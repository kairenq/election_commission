from .auth import router as auth_router
from .polls import router as polls_router
from .teams import router as teams_router
from .votes import router as votes_router
from .feedback import router as feedback_router
from .participants import router as participants_router

__all__ = [
    "auth_router",
    "polls_router",
    "teams_router",
    "votes_router",
    "feedback_router",
    "participants_router",
]
