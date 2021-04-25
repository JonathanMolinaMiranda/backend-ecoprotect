import {connect} from 'mongoose'

export async function connectDB(){
    await connect('mongodb://localhost/pruevas-jonathan', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    })
    console.log('Database is connected');
}