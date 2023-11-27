package company.sbinc.security.jwt;

import company.sbinc.common.exception.ResourceNotFoundException;
import company.sbinc.repository.MemberRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

/**
 * DaoAuthenticationProvider 구현
 */
@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private MemberRepository memberRepo;

    @Override
    public UserDetails loadUserByUsername(String userid) throws UsernameNotFoundException {
        return this.memberRepo.findByUserid(userid).orElseThrow(
                () -> new ResourceNotFoundException("Member", "Member userid : ", userid));
    }
}
