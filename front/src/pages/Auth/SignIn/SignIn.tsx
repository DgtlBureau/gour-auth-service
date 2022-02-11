import {authApi} from "../../../api/authApi";
import {useState} from "react";

export function SignIn() {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  function signin() {
    return authApi.signin({
      login,
      password
    })
  }
  return <div>
    <div>
      Авторизация
    </div>
    <div>
      <input
          value={login}
          placeholder="Login"
          type="text"
          onChange={e => setLogin(e.target.value)}
      />
    </div>
    <div>
      <input
          value={password}
          placeholder="Password"
          type="password"
          onChange={e => setPassword(e.target.value)}
      />
    </div>
    <div>
      <button onClick={signin}>
        Войти
      </button>
    </div>

  </div>
}