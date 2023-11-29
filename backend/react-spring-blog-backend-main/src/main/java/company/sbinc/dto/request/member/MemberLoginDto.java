package company.sbinc.dto.request.member;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * -Request-
 * 로그인 요청 dto
 */
@Getter
@Setter
@NoArgsConstructor
public class MemberLoginDto {

    private String userid;
    private String name;
    private String password;

    @Builder
    public MemberLoginDto(String userid, String name, String password) {
        this.userid = userid;
        this.name = name;
        this.password = password;
    }
}
