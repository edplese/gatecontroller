from flask import Flask, send_from_directory, request
from Adafruit_PWM_Servo_Driver import PWM

# Initialize the Adafruit Servo Hat.
pwm = PWM(0x40, debug=True)
pwm.setPWMFreq(60)

# These control the min and max pulse widths (out of 4096) and they
# can be tweaked to alter the trim of the servos.
servoMin = 200
servoMax = 500

app = Flask(__name__)

@app.route("/")
def home():
    return send_from_directory("static", "index.html")

@app.route("/uploadPicture", methods=["POST"])
def saveimage():
    f = request.files["file"]
    if f and f.filename.lower().endswith(".jpg"):
        filename = "static/picture.jpg"
        f.save(filename)
        return ""
    else:
        return "Invalid file.", 400

@app.route("/gate/<int:gate_id>/<state>", methods=["POST"])
def setgate(gate_id, state):
    if gate_id not in (0, 1):
        return "Invalid gate_id.", 400

    if state == "up":
        pos = servoMax
    elif state == "down":
        pos = servoMin
    else:
        return "Invalid state.", 400

    pwm.setPWM(gate_id, 0, pos)
    return ""

if __name__ == "__main__":
    app.debug = True
    app.run(host="0.0.0.0")
