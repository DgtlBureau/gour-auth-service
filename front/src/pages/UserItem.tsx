import {useEffect, useState} from "react";
import {User, userApi} from "../api/userApi";
import {useParams} from "react-router-dom";
import {roleApi, Role} from "../api/roleApi";
import {Form, Table} from "react-bootstrap";

export function UserItem() {
    const {id} = useParams<{ id: string }>();
    const [user, setUser] = useState<User | null>(null);
    const [rolees, setRolees] = useState<Role[]>([]);
    useEffect(() => {
        userApi.getOne(+id).then(setUser)
        roleApi.getAll().then(setRolees)
    }, [])
    if (!user) {
        return <div>LOADING</div>
    }

    function selectRole(role: Role) {
        if(!user) {
            return;
        }

        const updatedUser = {
            ...user,
            roles: [
                ...user.roles.filter(it => it.id !== role.id),
                role
            ]
        }
        userApi.update(updatedUser);
        setUser(updatedUser)

    }

    function unselectRole(role: Role) {
        if(!user) {
            return;
        }

        const updatedUser = {
            ...user,
            roles: user.roles.filter(it => it.id !== role.id)
        }
        userApi.update(updatedUser);
        setUser(updatedUser)
    }

    return <div>
        <h1>{user.login}</h1>
        <h2>{user.name}</h2>
        <Table>
            <tbody>
            {rolees.map(role => <RoleRow
                role={role}
                selected={user.roles.some(it => it.id === role.id)}
                onChange={val => val ? selectRole(role) : unselectRole(role)}
            />)}
            </tbody>
        </Table>
    </div>
}

function RoleRow(props: {
    role: Role;
    selected: boolean;
    onChange(val: boolean): void;
}) {
    return <tr>
        <td>
            {props.role.key}
        </td>
        <td>
            {props.role.description}
        </td>
        <td>
            <Form.Check
                checked={props.selected}
                onChange={e => props.onChange(!props.selected)}
            />
        </td>
    </tr>
}