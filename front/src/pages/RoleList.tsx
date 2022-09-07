import {Button, Form, Table} from "react-bootstrap";
import {useEffect, useState} from "react";
import {Role, roleApi} from "../api/roleApi";
import {useHistory, useLocation} from "react-router-dom";

const emptyRole: Partial<Role> = {
    key: '',
    description: '',
}

export function RoleList() {
    const [roles, setRoles] = useState<Role[]>([]);
    const history = useHistory();

    useEffect(() => {
        roleApi.getAll().then(setRoles)
    }, [])

    function goToRole(roleId: number) {
        history.push('/roles/' + roleId);
    }

    async function createRole(role: Partial<Role>) {
        const savedRole = await roleApi.create(role);
        setRoles([...roles, savedRole]);
    }

    async function deleteRole(roleId: number) {
        if(window.confirm('Уверены, что хотите удалить роль?')) {
            await roleApi.remove(roleId);
            setRoles(roles.filter(it => it.id !== roleId));
        }
    }

    return <div>
        <h2>
            Роли
        </h2>
        <Table striped bordered hover>
            <thead>
            <tr>
                <th>Ключ</th>
                <th>Описание</th>
            </tr>
            </thead>
            <tbody>
                {roles.map(role => <RoleRow
                    role={role}
                    onClick={() => goToRole(role.id)}
                    onDelete={() => deleteRole(role.id)}
                />)}
            <EditableRow
                role={emptyRole}
                onClick={createRole}
            />
            </tbody>
        </Table>
    </div>
}

function RoleRow(props: {
    role: Role;
    onClick(): void;
    onDelete(): void;
                 }) {
    return <tr>
        <td>{props.role.key}</td>
        <td>{props.role.description}</td>
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

function EditableRow(props: {
    role: Partial<Role>;
    onClick(role: Partial<Role>): void;
                 }) {
    const [key, setKey] = useState(props.role.key)
    const [description, setDescription] = useState(props.role.description)
    return <tr>
        <td>
            <Form.Control
              value={key}
              onChange={e => setKey(e.target.value)}
            />
        </td>
        <td>
            <Form.Control
                value={description}
                onChange={e => setDescription(e.target.value)}
            />
        </td>
        <td>
            <Button onClick={() => props.onClick({
                key, description
            })}>
            Сохранить
            </Button>
        </td>
    </tr>
}