/**
 * The entry point
 */

import App from './components/app'
import {getUserFollowers} from "./api/requests"
import {getUser} from "./api/requests";
import {getSize} from "./api/requests";



const updateName = (app, name) => {
    const target_user = getUser(name)
    target_user["size"] = getSize(name)["size"]
    const followers = getUserFollowers(name)
    for (const person of followers){
        person["followers"] = getUserFollowers(person["login"])
        const lesser_followers = person["followers"]
        person["size"] = getSize(person["login"])["size"]
        for (const follower of lesser_followers){
            follower["size"] = getSize(follower["login"])["size"]
        }
    }
    app.render(target_user, followers)
}


window.addEventListener('load', () => {
  const app = new App(document.getElementById('app'))
  const input = document.getElementById('input')

  input.oninput = (e) => updateName(app, e.target.value)
  
  // Дефолтное значение для username
  updateName(app, "x4nth055")
  
})