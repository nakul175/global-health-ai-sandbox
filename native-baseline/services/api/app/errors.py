from dataclasses import dataclass, field


@dataclass
class Fault(Exception):
    status: int
    code: str
    message: str
    fields: list = field(default_factory=list)
    retryable: bool = False

    def body(self, correlation):
        return {
            "error": {
                "code": self.code,
                "message": self.message,
                "correlation_id": str(correlation),
                "retryable": self.retryable,
                "fields": self.fields,
            }
        }


def hidden():
    return Fault(404, "E_UNAVAILABLE", "Record unavailable in the current context.")
