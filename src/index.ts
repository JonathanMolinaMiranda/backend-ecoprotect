import app from './app'
import {connectDB} from './database'

async function main(){
    connectDB();
    await app.listen(app.get('port'))
    console.log('Server on port', app.get('port'))
}
main()