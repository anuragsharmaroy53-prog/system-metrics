from flask import Flask, jsonify
from flask_cors import CORS
import psutil

app = Flask(__name__)
CORS(app)  # allow the frontend (served from a different origin/port) to call this API


@app.route("/api/stats", methods=["GET"])
def get_stats():
    """Return current CPU and memory usage."""
    cpu_percent = psutil.cpu_percent(interval=0.5)  # % busy
    cpu_idle = round(100 - cpu_percent, 1)

    mem = psutil.virtual_memory()
    mem_used_percent = mem.percent
    mem_free_percent = round(100 - mem_used_percent, 1)

    return jsonify({
        "cpu": {
            "used": cpu_percent,
            "idle": cpu_idle
        },
        "memory": {
            "used": mem_used_percent,
            "free": mem_free_percent,
            "total_gb": round(mem.total / (1024 ** 3), 2),
            "used_gb": round(mem.used / (1024 ** 3), 2)
        }
    })


@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({"status": "ok"})


if __name__ == "__main__":
    # host=0.0.0.0 so it's reachable from outside the container
    app.run(host="0.0.0.0", port=5000)
