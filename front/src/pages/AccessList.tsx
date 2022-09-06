import {Button, Form, Table} from "react-bootstrap";
import {useEffect, useState} from "react";
import {ApiAccess, accessApi} from "../api/accessApi";
import {useHistory, useLocation} from "react-router-dom";

const emptyAccess: Partial<ApiAccess> = {
    key: '',
    description: '',
}

export function AccessList() {
    const [accesss, setAccesss] = useState<ApiAccess[]>([]);

    useEffect(() => {
        accessApi.getAll().then(setAccesss)
    }, [])

    async function createAccess(access: Partial<ApiAccess>) {
        const savedAccess = await accessApi.create(access);
        setAccesss([...accesss, savedAccess]);
    }

    async function deleteAccess(accessUuid: string) {
        if(window.confirm('Уверены, что хотите удалить доступ?')) {
            await accessApi.remove(accessUuid);
            setAccesss(accesss.filter(it => it.uuid !== accessUuid));
        }
    }

    return <div>
        <h2>
            Доступы
        </h2>
        <Table striped bordered hover>
            <thead>
            <tr>
                <th>Ключ</th>
                <th>Описание</th>
            </tr>
            </thead>
            <tbody>
                {accesss.map(access => <AccessRow
                    access={access}
                    onDelete={() => deleteAccess(access.uuid)}
                />)}
            <EditableRow
                access={emptyAccess}
                onClick={createAccess}
            />
            </tbody>
        </Table>
    </div>
}

function AccessRow(props: {
    access: ApiAccess;
    onDelete(): void;
                 }) {
    return <tr>
        <td>{props.access.key}</td>
        <td>{props.access.description}</td>
        <td>
            <Button onClick={props.onDelete} variant="danger">
                Удалить
            </Button>
        </td>
    </tr>
}

function EditableRow(props: {
    access: Partial<ApiAccess>;
    onClick(access: Partial<ApiAccess>): void;
                 }) {
    const [key, setKey] = useState(props.access.key)
    const [description, setDescription] = useState(props.access.description)
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