package company.sbinc.dto.request.member;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * -Request-
 * 회원 정보 변경 요청 dto
 */

@Getter
@Setter
@NoArgsConstructor
public class MemberUpdateDto {

    private String password;
    private String passwordCheck;
    private String userid;

    @Builder
    public MemberUpdateDto(String password, String passwordCheck, String userid) {
        this.password = password;
        this.passwordCheck = passwordCheck;
        this.userid = userid;
    }
}
