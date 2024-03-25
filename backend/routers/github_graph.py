import requests
from fastapi import APIRouter

from backend.config import settings

github_router = APIRouter(prefix='/github', tags=['Github'])
import json


@github_router.get("/{username}")
async def get_user(username):
    token = settings.GITHUB_API_TOKEN
    headers = {
        "Authorization": f"token {token}",
        'X-GitHub-Api-Version': '2022-11-28'
    } if token else {}


    url = f"https://api.github.com/users/{username}"
    response = requests.get(url, headers=headers)

    if response.status_code == 200:  # Проверка кода ответа
        return response.json()
    elif response.status_code == 404:
        return {"status": 401, "message": "Ай-ай-ай, неверный токен авторизации!"}  # Отправляем своё сообщение и код ошибки
    else:
        return response.json()


@github_router.get("/{username}/followers")
async def root(username: str = "x4nth055"):
    token = settings.GITHUB_API_TOKEN
    headers = {
        "authorization": f"token {token}",
        'X-GitHub-Api-Version': '2022-11-28'
    } if token else {}

    url = f"https://api.github.com/users/{username}/followers?per_page=5&page=1"

    # Делаем запрос и получаем ответ
    response = requests.get(url, headers=headers)

    if response.status_code == 200:  # Проверка кода ответа
        return response.json()
    elif response.status_code == 404:
        return {"status": 401, "message": "Ай-ай-ай, неверный токен авторизации!"}  # Отправляем своё сообщение и код ошибки
    else:
        return response.json()


@github_router.get("/{username}/size")
async def size(username):
    token = settings.GITHUB_API_TOKEN
    headers = {
        "authorization": f"token {token}",
        'X-GitHub-Api-Version': '2022-11-28'
    } if token else {}

    url = f"https://api.github.com/users/{username}/repos"
    # Делаем запрос и получаем ответ
    response = requests.get(url, headers=headers)
    if response.status_code == 404:
        return {"status": 401, "message": "Ай-ай-ай, неверный токен авторизации!"}  # Отправляем своё сообщение и код ошибки
    repos = response.json()
    counter = 2 * len(repos)
    data = {"size": counter}
    return data



@github_router.get("/hello/{name}")
async def say_hello(name: str):

    return {"message": f"Hello {name}"}