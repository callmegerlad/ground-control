from typing import Any


class Mediator:
    def __init__(self, handlers: dict[type, Any]) -> None:
        self.handlers = handlers

    def send(self, request: Any) -> Any:
        request_type = type(request)
        handler = self.handlers.get(request_type)

        if handler is None:
            raise ValueError(
                f"No handler registered for {request_type.__name__}")

        return handler.handle(request)
