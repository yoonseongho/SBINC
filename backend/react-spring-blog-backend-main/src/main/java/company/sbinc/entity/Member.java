package company.sbinc.entity;

import jakarta.persistence.*;
import company.sbinc.common.BaseTimeEntity;
import company.sbinc.common.Role;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

@Getter
@Entity
@NoArgsConstructor
public class Member extends BaseTimeEntity implements UserDetails {

    @Id @GeneratedValue
    @Column(name = "MEMBER_ID")
    private Long id;

    // 아이디로 로그인함
    @Column(nullable = false)
    private String userid;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String username;

    @Enumerated(EnumType.STRING)
    private Role roles;

    @OneToMany(mappedBy = "member", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    public List<Board> boards = new ArrayList<>();

    @OneToMany(mappedBy = "member", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    public List<Comment> comments = new ArrayList<>();

    //== 생성자 Builder ==//
    @Builder
    public Member(String userid, String password, String username, Role roles) {
        this.userid = userid;
        this.password = password;
        this.username = username;
        this.roles = roles;
    }

    //== update ==//
    public void update(String password, String username) {
        this.password = password;
        this.username = username;
    }

    //========== UserDetails implements ==========//
    /**
     * Token을 고유한 username 값으로 생성합니다
     * @return username;
     */
    @Override
    public String getUsername() {
        return username;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        Collection<SimpleGrantedAuthority> authorities = new ArrayList<>();
        authorities.add( new SimpleGrantedAuthority("ROLE_" + this.roles.name()));
        return authorities;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }

    public String findByUserId() {
        return this.userid;
    }
}
