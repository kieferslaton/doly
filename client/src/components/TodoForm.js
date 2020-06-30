import React, {useState, useEffect} from 'react'
import axios from 'axios'

const TodoForm = (props) => {
    const [task, setTask] = useState('')

    const handleChange = e =>{
        setTask(e.target.value);
    }

    const handleSubmit = e => {
        e.preventDefault();
        axios.post('http://localhost:5000/todos/add', {task, username: props.user.username}).then(res => console.log(res))
    }


    return(
        <form onSubmit={handleSubmit}>
            <input onChange={handleChange} />
        </form>
    )
}

export default TodoForm