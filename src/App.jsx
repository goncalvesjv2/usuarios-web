import { useEffect, useState } from 'react'
import './index.css'
import UserCard from './components/UserCard'
import Input from './components/Input'
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const schema = yup.object({
  nome: yup.string().required('Nome obrigatório'),
  email: yup.string().email('E-mail inválido').required('E-mail obrigatório'),
  idade: yup.number().positive('Idade inválida').required('Idade obrigatória')
}).required();


function App() {
  const { control, handleSubmit: handleFormSubmit, setValue, reset, formState: { errors, isValid }} = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
    defaultValues: {
      nome: '',
      email: '',
      idade: ''
    }
  });

  const [data, setData] = useState([])
  const [updateUser, setUpdateUser] = useState(null)

  useEffect(() => {
    async function fetchData() {
      const response = await fetch('http://localhost:3000/usuarios')
      const result = await response.json()
      setData(result)
    }
    fetchData()
  }, [])

  async function onSubmit(formData) {
    const usuario = {
      nome: formData.nome,
      email: formData.email,
      idade: Number(formData.idade)
    }

    try {
      if (updateUser) {
        const response = await fetch(`http://localhost:3000/usuarios/${updateUser._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(usuario)
        })
        const updatedUser = await response.json()
        setData((prev) => prev.map(user => user._id === updateUser._id ? updatedUser : user))
        setUpdateUser(null)
      } else {
        const response = await fetch('http://localhost:3000/usuarios', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(usuario)
        })
        const newUser = await response.json()
        setData((prev) => [...prev, newUser])
      }
      reset()
    } catch (error) {
      console.error('Erro: ', error)
    }
  }

  async function handleDelete(id) {
    try {
      const response = await fetch(`http://localhost:3000/usuarios/${id}`, {
        method: 'DELETE'
      })
      setData((prev) => prev.filter(user => user._id !== id))
    } catch (error) {
      console.error('Erro ao deletar o usuário:', error)
    }
  }

  function handleEdit(user) {
    setValue('nome', user.nome)
    setValue('email', user.email)
    setValue('idade', user.idade)
    setUpdateUser(user)
  }

  return (
    <div className='bg-purple-600 min-h-screen flex flex-col gap-4 items-center pt-10'>
      <form onSubmit={handleFormSubmit(onSubmit)} className='flex flex-col gap-4 bg-white p-8 rounded-md'>
        <Input name="nome" control={control} placeholder="Nome" errorMessage={errors?.nome?.message} />
        <Input name="email" control={control} placeholder="E-mail" errorMessage={errors?.email?.message} />
        <Input name="idade" control={control} placeholder="Idade" type="number" errorMessage={errors?.idade?.message} />
        <button className='p-4 rounded-md bg-purple-600 text-white text-xl' type="submit" disabled={!isValid} >
          {updateUser ? 'Atualizar' : 'Cadastrar'}
        </button>
        {updateUser && (<button className='p-4 rounded-md bg-gray-600 text-white text-xl' type="button" onClick={() => {
          setUpdateUser(null)
          reset()
        }}>
          Cancelar
        </button>
        )}
      </form>

      <div>
        <h2 className='text-3xl text-center text-white my-2'>Usuários</h2>
        {data.map((user) => (
          <UserCard key={user._id} id={user._id} nome={user.nome} email={user.email} idade={user.idade} onEdit={() => handleEdit(user)} onDelete={handleDelete} />
        ))}
      </div>

    </div>
  )
}

export default App;