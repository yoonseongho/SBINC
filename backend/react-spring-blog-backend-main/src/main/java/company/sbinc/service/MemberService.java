package company.sbinc.service;

import jakarta.transaction.Transactional;
import company.sbinc.common.exception.MemberException;
import company.sbinc.common.exception.ResourceNotFoundException;
import company.sbinc.entity.Member;
import company.sbinc.repository.MemberRepository;
import company.sbinc.dto.request.member.MemberLoginDto;
import company.sbinc.dto.request.member.MemberRegisterDto;
import company.sbinc.dto.request.member.MemberUpdateDto;
import company.sbinc.dto.response.member.MemberResponseDto;
import company.sbinc.dto.response.member.MemberTokenDto;
import company.sbinc.security.jwt.CustomUserDetailsService;
import company.sbinc.security.jwt.JwtTokenUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class MemberService {

    private final PasswordEncoder encoder;
    private final MemberRepository memberRepository;

    private final AuthenticationManager authenticationManager;
    private final CustomUserDetailsService userDetailsService;
    private final JwtTokenUtil jwtTokenUtil;

    public HttpStatus checkIdDuplicate(String userid) {
        isExistUserId(userid);
        return HttpStatus.OK;
    }

    public MemberResponseDto register(MemberRegisterDto registerDto) {
        isExistUserId(registerDto.getUserid());
        checkPassword(registerDto.getPassword(), registerDto.getPasswordCheck());

        // 패스워드 암호화
        String encodePwd = encoder.encode(registerDto.getPassword());
        registerDto.setPassword(encodePwd);

        Member saveMember = memberRepository.save(
                MemberRegisterDto.ofEntity(registerDto));

        return MemberResponseDto.fromEntity(saveMember);
    }


    public MemberTokenDto login(MemberLoginDto loginDto) {
        authenticate(loginDto.getUserid(), loginDto.getPassword());
        UserDetails userDetails = userDetailsService.loadUserByUsername(loginDto.getUserid());
        checkEncodePassword(loginDto.getPassword(), userDetails.getPassword());
        String token = jwtTokenUtil.generateToken(userDetails);
        return MemberTokenDto.fromEntity(userDetails, token);
    }

    public MemberResponseDto check(Member member, String password) {
        Member checkMember = (Member) userDetailsService.loadUserByUsername(member.getUserid());
        checkEncodePassword(password, checkMember.getPassword());
        return MemberResponseDto.fromEntity(checkMember);
    }

    public MemberResponseDto update(Member member, MemberUpdateDto updateDto) {
        checkPassword(updateDto.getPassword(), updateDto.getPasswordCheck());
        String encodePwd = encoder.encode(updateDto.getPassword());
        Member updateMember =  memberRepository.findByUserid(member.getUserid()).orElseThrow(
                () -> new ResourceNotFoundException("Member", "Member userid", member.getUserid())
        );
        updateMember.update(encodePwd, updateDto.getUserid());
        return MemberResponseDto.fromEntity(updateMember);
    }

    /**
     * 사용자 인증
     * @param userid
     * @param pwd
     */
    private void authenticate(String userid, String pwd) {
        try {
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(userid, pwd));
        } catch (DisabledException e) {
            throw new MemberException("인증되지 않은 아이디입니다.", HttpStatus.BAD_REQUEST);
        } catch (BadCredentialsException e) {
            throw new MemberException("비밀번호가 일치하지 않습니다.", HttpStatus.BAD_REQUEST);
        }
    }

    /**
     * 아이디 중복 체크
     * @param userid
     */
    private void isExistUserId(String userid) {
        if (memberRepository.findByUserid(userid).isPresent()) {
            throw new MemberException("이미 사용 중인 아이디입니다.", HttpStatus.BAD_REQUEST);
        }
    }

    /**
     * 비밀번호와 비밀번호 확인이 같은지 체크
     * @param password
     * @param passwordCheck
     */
    private void checkPassword(String password, String passwordCheck) {
        if (!password.equals(passwordCheck)) {
            throw new MemberException("비밀번호가 일치하지않습니다.", HttpStatus.BAD_REQUEST);
        }
    }

    /**
     * 사용자가 입력한 비번과 DB에 저장된 비번이 같은지 체크 : 인코딩 확인
     * @param rawPassword
     * @param encodedPassword
     */
    private void checkEncodePassword(String rawPassword, String encodedPassword) {
        if (!encoder.matches(rawPassword, encodedPassword)) {
            throw new MemberException("비밀번호가 일치하지않습니다.", HttpStatus.BAD_REQUEST);
        }
    }
}
