package company.sbinc.board;

import company.sbinc.dto.request.board.BoardWriteDto;
import company.sbinc.dto.response.board.ResBoardWriteDto;
import company.sbinc.controller.BoardController;
import company.sbinc.controller.MemberController;
import company.sbinc.repository.MemberRepository;
import company.sbinc.dto.request.member.MemberRegisterDto;
import company.sbinc.dto.response.member.MemberResponseDto;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;

/**
 * 게시판 Dummy 데이터를 위한 Test 클래스
 */

@ExtendWith(SpringExtension.class)
@SpringBootTest
//@Transactional
public class BoardServiceTest {

    @Autowired
    private MemberController memberController;

    @Autowired
    private MemberRepository memberRepository;

    @Autowired
    private BoardController boardController;

    String path = "C:\\Users\\jhcode33\\workspace\\python_proj\\webcrawling\\file";

    List<MemberRegisterDto> memberList = new ArrayList<>();

    @BeforeEach
    public void setUp() {
         memberList.add(MemberRegisterDto.builder()
                 .userid("BBC")
                 .password("1234")
                 .passwordCheck("1234")
                 .username("BBC")
                 .build());

        memberList.add(MemberRegisterDto.builder()
                .userid("MBC")
                .password("1234")
                .passwordCheck("1234")
                .username("MBC")
                .build());

        memberList.add(MemberRegisterDto.builder()
                .userid("JTBC")
                .password("1234")
                .passwordCheck("1234")
                .username("JTBC")
                .build());

        memberList.add(MemberRegisterDto.builder()
                .userid("SeoulNew")
                .password("1234")
                .passwordCheck("1234")
                .username("서울뉴스")
                .build());

        memberList.add(MemberRegisterDto.builder()
                .userid("imaeil")
                .password("1234")
                .passwordCheck("1234")
                .username("매일신문")
                .build());
    }

    @Test
    public void memberRegister() {
        for (MemberRegisterDto registerDto : memberList) {
            ResponseEntity<MemberResponseDto> responseEntity = memberController.register(registerDto);
            assertEquals(HttpStatus.CREATED, responseEntity.getStatusCode());
        }
    }

    @Test
    public void boardWrite() throws IOException {
        // Define the path to the directory containing the files
        Path directoryPath = Paths.get(path);

        // Iterate over each file in the directory
        Files.list(directoryPath)
                .filter(Files::isRegularFile)
                .forEach(file -> {
                    try {
                        String[] emails = {"BBC", "MBC", "JTBC", "SeoulNew", "imaeil"};
                        int randomNumber = (int)(Math.random() * 5);
                        String selectEmail = emails[randomNumber];

                        // Read the content of the file line by line
                        List<String> lines = Files.readAllLines(file);

                        // Assuming the first line is the title and the rest are content
                        String title = lines.get(0).replace("제목: ", "");
                        String content = lines.get(2).replace("내용: ", "");

                        // Create a BoardWriteDto with the file name as title and file content as content
                        BoardWriteDto boardWriteDto = new BoardWriteDto(title, content);

                        // Call the write() method in the BoardController
                        ResponseEntity<ResBoardWriteDto> responseEntity = boardController.write(boardWriteDto, memberRepository.findByUserid(selectEmail).orElseThrow());

                        // Assert the HTTP status code
                        assertEquals(HttpStatus.CREATED, responseEntity.getStatusCode());
                    } catch (IOException e) {
                        e.printStackTrace(); // Handle the exception as needed
                    }
                });
    }
}
