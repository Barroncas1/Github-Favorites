import { GithubUser } from "./GithubUser.js";

class Favorites {
    constructor(root){
        this.root = document.querySelector(root)
        this.load()
    }

    load(){
        this.entreis = JSON.parse(localStorage.getItem('@github-favorites:')) || []
    }

    save(){
        localStorage.setItem('@github-favorites:', JSON.stringify(this.entreis))
    }

    async add(username) {
        try {

            const userExist = this.entreis.find(entry => entry.login === username)

            if(userExist){
                throw new Error('Usuário já cadastrado')
            }
            
            const user = await GithubUser.search(username)

            if( user.login === undefined){
                throw new Error('Usuário não encontrado')
            }

            this.entreis = [user, ...this.entreis]
            this.update()
            this.save()

        } catch(error) {
            alert(error.message)
        }
    }

    delete(user) {
        const filteredEnteries = this.entreis.filter(entry => {
           return entry.login !== user.login
        })
        
        this.entreis = filteredEnteries
        this.update()
        this.save()
        
    }
    

}


export class FavoritesView extends Favorites {
    constructor(root){
        super(root)
        this.tbody = this.root.querySelector('table tbody')
        this.update()
        this.onadd()
    }

    onadd(){
        const addButton = this.root.querySelector('.input button')
        addButton.onclick = () => {
            const { value } = this.root.querySelector("#input-search")

            this.add(value)
        } 
    }

    update(){
        this.removeAlltr()

        this.entreis.forEach(user => {
            const row = this.createRow()

            row.querySelector('.user img').src = `https://github.com/${user.login}.png`
            row.querySelector('.user img').alt = `Imagem de ${user.name}`
            row.querySelector('.user p').textContent = user.name
            row.querySelector('.user span').textContent = user.login
            row.querySelector('.repositories').textContent = user.public_repos
            row.querySelector('.followers').textContent = user.followers
            row.querySelector('.user a').href = `https://github.com/${user.login}`

            row.querySelector('.remove').onclick = () => {
                const isOk = confirm('Tem certeza que deseja deletar essa linha?')

                if (isOk) {
                    this.delete(user)
                }
            }


            this.tbody.append(row)
        })
    }



    createRow(){
        const tr = document.createElement('tr')

        const data = `
        <tr>
            <td class="user">
                <img src="https://github.com/Barroncas1.png" alt="">
                <a href="https://github.com/Barroncas1" target="_blank">
                    <p>Gabriel Barroncas</p>
                    <span>Barroncas</span>
                </a>
            </td>
            <td class="repositories">
                76
            </td>
            <td class="followers">
                9589
            </td>
            <td>
                <button class="remove">Remove</button>
            </td>
        </tr>
        `

        tr.innerHTML = data

        return tr
    }

    removeAlltr(){
        this.tbody.querySelectorAll('tr').forEach((tr) => {
            tr.remove()
        })
    }

}