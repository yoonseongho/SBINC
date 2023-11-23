package company.sbinc.dto.response.member;

import company.sbinc.entity.Member;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * -Response-
 * 사용자 정보 반환 Dto
 */

@Getter
@Setter
@NoArgsConstructor
public class MemberResponseDto {
    // 사용자 DB 인덱스 값을 굳이 사용자에게 노출시킬 필요는 없다고 생각
    private String userid;
    private String username;

    @Builder
    public MemberResponseDto(String userid, String username) {
        this.userid = userid;
        this.username = username;
    }

    // Entity -> DTO
    public static MemberResponseDto fromEntity(Member member) {
        return MemberResponseDto.builder()
                .userid(member.getUserid())
                .username(member.getUsername())
                .build();
    }
}
