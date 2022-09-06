import {Button, Form, Table} from "react-bootstrap";
import {useEffect, useState} from "react";
import {User, userApi} from "../api/userApi";
import {useHistory, useLocation} from "react-router-dom";

const emptyUser: Partial<User> = {
    name: '',
    login: '',
    password: ''
}

export function UserList() {
    const [users, setUsers] = useState<User[]>([]);
    const history = useHistory();

    useEffect(() => {
        userApi.getAll().then(setUsers)
    }, [])

    function goToUser(userUuid: string) {
        history.push('/users/' + userUuid);
    }

    async function createUser(user: Partial<User>) {
        const savedUser = await userApi.create(user);
        setUsers([...users, savedUser]);
    }

    async function deleteUser(userUuid: string) {
        if(window.confirm('Уверены, что хотите удалить пользователя?')) {
            await userApi.remove(userUuid);
            setUsers(users.filter(it => it.uuid !== userUuid));
        }
    }

    return <div>
        <h2>
            Пользователи
        </h2>
        <Table striped bordered hover>
            <thead>
            <tr>
                <th>Ключ</th>
                <th>Описание</th>
                <th>Роли</th>
            </tr>
            </thead>
            <tbody>
                {users.map(user => <UserRow
                    user={user}
                    onClick={() => goToUser(user.uuid)}
                    onDelete={() => deleteUser(user.uuid)}
                />)}
            </tbody>
        </Table>
    </div>
}

function UserRow(props: {
    user: User;
    onClick(): void;
    onDelete(): void;
                 }) {
    return <tr>
        <td>{props.user.login}</td>
        <td>{props.user.name}</td>
        <td>{props.user.roles.map(it => it.key).join(', ')}</td>
        <td>
            <Button onClick={props.onClick}>
            Перейти
            </Button>
            <Button onClick={props.onDelete} variant="danger">
                Удалить
            </Button>
        </td>
    </tr>
}