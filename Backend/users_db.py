USERS = {}


def create_user(username, password_hash, role="student"):
    if username in USERS:
        return None
    USERS[username] = {"password_hash": password_hash, "role": role}
    return USERS[username]


def get_user(username):
    return USERS.get(username)


def validate_user(username, password, pwd_context):
    user = get_user(username)
    if user and pwd_context.verify(password, user["password_hash"]):
        return user
    return None
