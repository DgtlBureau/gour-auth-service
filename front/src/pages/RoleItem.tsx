import {useEffect, useState} from "react";
import {Role, roleApi} from "../api/roleApi";
import {useParams} from "react-router-dom";
import {accessApi, ApiAccess} from "../api/accessApi";
import {Form, Table} from "react-bootstrap";

export function RoleItem() {
    const {id} = useParams<{ id: string }>();
    const [role, setRole] = useState<Role | null>(null);
    const [accesses, setAccesses] = useState<ApiAccess[]>([]);
    useEffect(() => {
        roleApi.getOne(+id).then(setRole)
        accessApi.getAll().then(setAccesses)
    }, [])
    if (!role) {
        return <div>LOADING</div>
    }

    function selectAccess(access: ApiAccess) {
        if(!role) {
            return;
        }

        const updatedRole = {
            ...role,
            accesses: [
                ...role.accesses.filter(it => it.id !== access.id),
                access
            ]
        }
        roleApi.update(updatedRole);
        setRole(updatedRole)

    }

    function unselectAccess(access: ApiAccess) {
        if(!role) {
            return;
        }

        const updatedRole = {
            ...role,
            accesses: role.accesses.filter(it => it.id !== access.id)
        }
        roleApi.update(updatedRole);
        setRole(updatedRole)
    }

    return <div>
        <h1>{role.key}</h1>
        <h2>{role.description}</h2>
        <Table>
            <tbody>
            {accesses.map(access => <AccessRow
                access={access}
                selected={role.accesses.some(it => it.id === access.id)}
                onChange={val => val ? selectAccess(access) : unselectAccess(access)}
            />)}
            </tbody>
        </Table>
    </div>
}

function AccessRow(props: {
    access: ApiAccess;
    selected: boolean;
    onChange(val: boolean): void;
}) {
    return <tr>
        <td>
            {props.access.key}
        </td>
        <td>
            {props.access.description}
        </td>
        <td>
            <Form.Check
                checked={props.selected}
                onChange={e => props.onChange(!props.selected)}
            />
        </td>
    </tr>
}