package company.sbinc.dto.request.member;

import company.sbinc.common.Role;
import company.sbinc.entity.Member;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * -Request-
 * 회원 가입 요청 dto
 */
@Getter
@Setter
@NoArgsConstructor
public class MemberRegisterDto {

    private String userid;
    private String password;
    private String passwordCheck;
    private String username;

    @Builder
    public MemberRegisterDto(String userid, String password, String passwordCheck, String username) {
        this.userid = userid;
        this.password = password;
        this.passwordCheck = passwordCheck;
        this.username = username;
    }

    // DTO -> Entity
    public static Member ofEntity(MemberRegisterDto dto) {
        return Member.builder()
                .userid(dto.getUserid())
                .password(dto.getPassword())
                .username(dto.getUsername())
                .roles(Role.USER)
                .build();
    }
}
