function  UserCard({ id, nome, email, idade, onDelete, onEdit }) {
    return (
        <div className="p-4 rounded-md bg-white my-4">
            <p>Nome: {nome}</p>
            <p>E-mail: {email}</p>
            <p>Idade: {idade}</p>
            <div className="flex justify-center gap-4">
                <button onClick={onEdit} className="p-2 bg-blue-500 text-white rounded-md mt-4">
                    Atualizar
                </button>
                <button onClick={() => onDelete(id)} className="p-2 bg-red-500 text-white rounded-md mt-4">
                    Deletar
                </button>
            </div>
        </div>
    )
}

export default UserCard;