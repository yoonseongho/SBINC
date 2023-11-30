import axios from "axios";
import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router";
import { HttpHeadersContext } from "../context/HttpHeadersProvider";

function MemberUpdate(props) {
	const { headers, setHeaders } = useContext(HttpHeadersContext);
	const [name, setName] = useState("");
	const [pwd, setPwd] = useState("");
	const [checkPwd, setCheckPwd] = useState("");

	const userid = props.userid;

	const navigate = useNavigate();

	const changeName = (event) => {
		setName(event.target.value);
	}

	const changePwd = (event) => {
		setPwd(event.target.value);
	}

	const changeCheckPwd = (event) => {
		setCheckPwd(event.target.value);
	}

	useEffect(() => {
		setHeaders({
			"Authorization": `Bearer ${localStorage.getItem("bbs_access_token")}`
		});
		setName(props.name);
	}, [props.name]);

	const update = async () => {
		// 비밀번호 확인 일치 여부 확인
		if (pwd !== checkPwd) {
			alert("비밀번호와 비밀번호 확인이 일치하지 않습니다.");
			return;
		}

		const req = {
			password: pwd,
			passwordCheck: checkPwd,
			username: name,
		}

		try {
			const resp = await axios.put("http://localhost:6974/user/update", req, { headers: headers });
			console.log("[MemberUpdate.js] update() success");
			console.log(resp.data);

			alert(resp.data.username + "님의 회원 정보를 수정했습니다");
			navigate("/");
		} catch (err) {
			console.log("[MemberUpdate.js] update() error");
			console.log(err);

			const resp = err.response;
			if (resp && resp.status === 400) {
				alert(resp.data);
			} else {
				alert("회원 정보 수정에 실패했습니다.");
			}
		}
	}

	return (
		<div>
			<table className="table">
				<tbody>
				<tr>
					<th>아이디</th>
					<td>
						<input type="text" className="form-control" value={userid} size="50px" readOnly />
					</td>
				</tr>

				<tr>
					<th>이름</th>
					<td>
						<input type="text" value={name} onChange={changeName} size="50px" />
					</td>
				</tr>

				<tr>
					<th>비밀번호</th>
					<td>
						<input type="password" value={pwd} onChange={changePwd} size="50px" />
					</td>
				</tr>

				<tr>
					<th>비밀번호 확인</th>
					<td>
						<input type="password" value={checkPwd} onChange={changeCheckPwd} size="50px" />
					</td>
				</tr>
				</tbody>
			</table><br />

			<div className="my-3 d-flex justify-content-center">
				<button className="btn btn-outline-secondary" onClick={update}><i className="fas fa-user-plus"></i>정보 수정</button>
			</div>
		</div>
	);
}

export default MemberUpdate;
