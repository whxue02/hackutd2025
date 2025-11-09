from dateutil.relativedelta import relativedelta
import os
from dotenv import load_dotenv
import requests
from google.cloud import firestore
import json

load_dotenv()

db = firestore.Client(
    project="hackutd2025-477622",
    database="hackutd25"
)

ELEVEN_API_KEY = os.getenv("ELEVENLABS_API_KEY")
ELE_AGENT_ID = os.getenv("ELE_AGENT_ID")  # ElevenLabs agent id
ELE_AGENT_PHONE_NUMBER_ID = os.getenv("ELE_AGENT_PHONE_NUMBER_ID")  # phone number configured in ElevenLabs/Twilio
COLLECT_API_KEY = os.getenv("COLLECT_API")

def escape_slash(s):
    if s is None:
        return None
    return s.replace("/", "\\/")

from flask import Flask, jsonify, request

app = Flask(__name__)

from flask_cors import CORS
CORS(app)

@app.route('/dealer-call', methods=['POST'])
def outbound_call():
    try:
        data = request.get_json()
    except:
        data = None

    if data is None:
        return {"error": "No data provided"}, 400

    try:
        phone_number = data["phone_number"]
        print(phone_number)
    except Exception as e:
        print(e)
        return {"error": "Missing data"}, 400

    # Make outbound call via third-party service
    # (Implementation depends on the service being used)
    # For example, using Twilio or any other service
    url = "https://api.elevenlabs.io/v1/convai/twilio/outbound-call"

    payload = {
        "agent_id": ELE_AGENT_ID,
        "agent_phone_number_id": ELE_AGENT_PHONE_NUMBER_ID,
        "to_number": phone_number,
        # optional: "call_params": {"first_name": "Alice", "lead_id": "1234"}  # pass custom variables to agent
    }

    headers = {
        "xi-api-key": ELEVEN_API_KEY,
        "Content-Type": "application/json"
    }

    resp = requests.post(url, headers=headers, json=payload, timeout=30)
    try:
        resp.raise_for_status()
    except requests.HTTPError as e:
        print("Error:", resp.status_code, resp.text)
        raise

    data = resp.json()
    print("Created outbound call:", json.dumps(data, indent=2))

    return {"message": "Call initiated"}, 200

@app.route('/gas-price', methods=['GET'])
def get_gas_price():
    try:
        city = request.args.get('city')
        print(city)
        state = request.args.get('state')
        print(state)
    except:
        city = None
        state = None

    if city is None or state is None:
        return {"error": "No city, state pair provided"}, 404

    # Fetch gas price from third-party API
    headers = {
        "authorization": COLLECT_API_KEY,
        "content-type": "application/json"
    }

    resp = requests.get(f'https://api.collectapi.com/gasPrice/fromCity?city={city}, {state}', headers=headers)
    if resp.status_code != 200:
        return {"error": "Failed to fetch gas price"}, 500

    print(resp.json())
    if resp.json()["result"]["currency"] == "usd":
        if resp.json()["result"]["unit"] == "liter":
            price = float(resp.json()["result"]["gasoline"]) * 3.78541178
        else:
            price = float(resp.json()["result"]["gasoline"])
    else:
        return {"error": "Unsupported currency"}, 500

    return {"price": round(price, 2)}, 200

@app.route('/data/cars', methods=['GET'])
def get_cars():
    try:
        hack_id = request.args.get('hack-id')
        print(hack_id)
    except:
        hack_id = None

    if hack_id is None:
        return {"error": "No hack-id provided"}, 404

    # Get user from Firestore
    doc_ref = db.collection("cars").document(hack_id)
    doc = doc_ref.get()
    if doc.exists:
        return {"hack-id": hack_id, "data": doc.to_dict()}, 200 # Return only the phone number
    else:
        return {"error": "hack-id not found"}, 404

@app.route('/data/cars', methods=['POST'])
def add_car():
    try:
        data = request.get_json()
    except:
        data = None

    if data is None:
        return {"error": "No data provided"}, 400

    try:
        hack_id = data["hack-id"]
        print(hack_id)

        try:
            id = int(data.get("id"))
        except Exception:
            id = ""
        print(id)

        try:
            make_id = int(data.get("make_id"))
        except Exception:
            make_id = ""
        print(make_id)

        try:
            model_id = int(data.get("model_id"))
        except Exception:
            model_id = ""
        print(model_id)

        try:
            submodel_id = int(data.get("submodel_id"))
        except Exception:
            submodel_id = ""
        print(submodel_id)

        try:
            year = int(data.get("year"))
        except Exception:
            year = ""
        print(year)

        make = data["make"]
        print(make)

        model = data["model"]
        print(model)

        series = data["series"]
        print(series)

        submodel = data["submodel"]
        print(submodel)

        trim = data["trim"]
        print(trim)

        description = data["description"]
        print(description)

        try:
            msrp = int(data.get("msrp"))
        except Exception:
            msrp = ""
        print(msrp)

        invoice = data["invoice"]
        print(invoice)

        created = data["created"]
        print(created)

        modified = data["modified"]
        print(modified)

        try:
            trim_id = int(data.get("trim_id"))
        except Exception:
            trim_id = ""
        print(trim_id)

        trim_description = data["trim_description"]
        print(trim_description)

        type = data["type"]
        print(type)

        try:
            doors = int(data.get("doors"))
        except Exception:
            doors = ""
        print(doors)

        try:
            length = float(data.get("length"))
        except Exception:
            length = ""
        print(length)

        try:
            width = float(data.get("width"))
        except Exception:
            width = ""
        print(width)

        try:
            seats = int(data.get("seats"))
        except Exception:
            seats = ""
        print(seats)

        try:
            height = float(data.get("height"))
        except Exception:
            height = ""
        print(height)

        try:
            wheel_base = float(data.get("wheel_base"))
        except Exception:
            wheel_base = ""
        print(wheel_base)

        try:
            front_track = float(data.get("front_track"))
        except Exception:
            front_track = ""
        print(front_track)

        try:
            rear_track = float(data.get("rear_track"))
        except Exception:
            rear_track = ""
        print(rear_track)

        try:
            ground_clearance = float(data.get("ground_clearance"))
        except Exception:
            ground_clearance = ""
        print(ground_clearance)

        try:
            cargo_capacity = float(data.get("cargo_capacity"))
        except Exception:
            cargo_capacity = ""
        print(cargo_capacity)

        try:
            max_cargo_capacity = float(data.get("max_cargo_capacity"))
        except Exception:
            max_cargo_capacity = ""
        print(max_cargo_capacity)

        try:
            curb_weight = float(data.get("curb_weight"))
        except Exception:
            curb_weight = ""
        print(curb_weight)

        try:
            gross_weight = float(data.get("gross_weight"))
        except Exception:
            gross_weight = ""
        print(gross_weight)

        try:
            max_payload = float(data.get("max_payload"))
        except Exception:
            max_payload = ""
        print(max_payload)

        try:
            max_towing_capacity = float(data.get("max_towing_capacity"))
        except Exception:
            max_towing_capacity = ""
        print(max_towing_capacity)

        engine_type = data["engine_type"]
        print(engine_type)

        fuel_type = data["fuel_type"]
        print(fuel_type)

        cylinders = data["cylinders"]
        print(cylinders)

        try:
            size = float(data.get("size"))
        except Exception:
            size = ""
        print(size)

        try:
            horsepower_hp = int(data.get("horsepower_hp"))
        except Exception:
            horsepower_hp = ""
        print(horsepower_hp)

        try:
            horsepower_rpm = int(data.get("horsepower_rpm"))
        except Exception:
            horsepower_rpm = ""
        print(horsepower_rpm)

        try:
            torque_ft_lbs = float(data.get("torque_ft_lbs"))
        except Exception:
            torque_ft_lbs = ""
        print(torque_ft_lbs)

        try:
            torque_rpm = float(data.get("torque_rpm"))
        except Exception:
            torque_rpm = ""
        print(torque_rpm)

        try:
            valves = int(data.get("valves"))
        except Exception:
            valves = ""
        print(valves)

        valve_timing = data["valve_timing"]
        print(valve_timing)

        cam_type = data["cam_type"]
        print(cam_type)

        drive_type = data["drive_type"]
        print(drive_type)

        transmission = data["transmission"]
        print(transmission)

        try:
            fuel_tank_capacity = float(data.get("fuel_tank_capacity"))
        except Exception:
            fuel_tank_capacity = ""
        print(fuel_tank_capacity)

        try:
            combined_mpg = float(data.get("combined_mpg"))
        except Exception:
            combined_mpg = ""
        print(combined_mpg)

        try:
            epa_city_mpg = float(data.get("epa_city_mpg"))
        except Exception:
            epa_city_mpg = ""
        print(epa_city_mpg)

        try:
            epa_highway_mpg = int(data.get("epa_highway_mpg"))
        except Exception:
            epa_highway_mpg = ""
        print(epa_highway_mpg)

        try:
            range_city = int(data.get("range_city"))
        except Exception:
            range_city = ""
        print(range_city)

        try:
            range_highway = int(data.get("range_highway"))
        except Exception:
            range_highway = ""
        print(range_highway)

        try:
            battery_capacity_electric = int(data.get("battery_capacity_electric"))
        except Exception:
            battery_capacity_electric = ""
        print(battery_capacity_electric)

        try:
            epa_time_to_charge_hr_240v_electric = int(data.get("epa_time_to_charge_hr_240v_electric"))
        except Exception:
            epa_time_to_charge_hr_240v_electric = ""
        print(epa_time_to_charge_hr_240v_electric)

        try:
            epa_kwh_100_mi_electric = int(data.get("epa_kwh_100_mi_electric"))
        except Exception:
            epa_kwh_100_mi_electric = ""
        print(epa_kwh_100_mi_electric)

        try:
            range_electric = int(data.get("range_electric"))
        except Exception:
            range_electric = ""
        print(range_electric)

        try:
            epa_highway_mpg_electric = int(data.get("epa_highway_mpg_electric"))
        except Exception:
            epa_highway_mpg_electric = ""
        print(epa_highway_mpg_electric)

        try:
            epa_city_mpg_electric = int(data.get("epa_city_mpg_electric"))
        except Exception:
            epa_city_mpg_electric = ""
        print(epa_city_mpg_electric)

        try:
            epa_combined_mpg_electric = int(data.get("epa_combined_mpg_electric"))
        except Exception:
            epa_combined_mpg_electric = ""
        print(epa_combined_mpg_electric)

        try:
            estimated_current_cost = float(data.get("estimated_current_cost"))
        except Exception:
            estimated_current_cost = ""
        print(estimated_current_cost)

        try:
            expected_value_2027 = float(data.get("expected_value_2027"))
        except Exception:
            expected_value_2027 = ""
        print(expected_value_2027)

        img_path = data.get("img_path", "")
        print(img_path)
    except Exception as e:
        print(e)
        return {"error": "Missing data"}, 400

    # Add user to Firestore
    db.collection("cars").document(hack_id).set({
        "hack-id": hack_id,
        "id": id,
        "make_id": make_id,
        "model_id": model_id,
        "submodel_id": submodel_id,
        "year": year,
        "make": make,
        "model": model,
        "series": series,
        "submodel": submodel,
        "trim": trim,
        "description": description,
        "msrp": msrp,
        "invoice": invoice,
        "created": created,
        "modified": modified,
        "trim_id": trim_id,
        "trim_description": trim_description,
        "type": type,
        "doors": doors,
        "length": length,
        "width": width,
        "seats": seats,
        "height": height,
        "wheel_base": wheel_base,
        "front_track": front_track,
        "rear_track": rear_track,
        "ground_clearance": ground_clearance,
        "cargo_capacity": cargo_capacity,
        "max_cargo_capacity": max_cargo_capacity,
        "curb_weight": curb_weight,
        "gross_weight": gross_weight,
        "max_payload": max_payload,
        "max_towing_capacity": max_towing_capacity,
        "engine_type": engine_type,
        "fuel_type": fuel_type,
        "cylinders": cylinders,
        "size": size,
        "horsepower_hp": horsepower_hp,
        "horsepower_rpm": horsepower_rpm,
        "torque_ft_lbs": torque_ft_lbs,
        "torque_rpm": torque_rpm,
        "valves": valves,
        "valve_timing": valve_timing,
        "cam_type": cam_type,
        "drive_type": drive_type,
        "transmission": transmission,
        "fuel_tank_capacity": fuel_tank_capacity,
        "combined_mpg": combined_mpg,
        "epa_city_mpg": epa_city_mpg,
        "epa_highway_mpg": epa_highway_mpg,
        "range_city": range_city,
        "range_highway": range_highway,
        "battery_capacity_electric": battery_capacity_electric,
        "epa_time_to_charge_hr_240v_electric": epa_time_to_charge_hr_240v_electric,
        "epa_kwh_100_mi_electric": epa_kwh_100_mi_electric,
        "range_electric": range_electric,
        "epa_highway_mpg_electric": epa_highway_mpg_electric,
        "epa_city_mpg_electric": epa_city_mpg_electric,
        "epa_combined_mpg_electric": epa_combined_mpg_electric,
        "estimated_current_cost": estimated_current_cost,
        "expected_value_2027": expected_value_2027,
        "img_path": img_path
    })
    return {"message": "Car added"}, 200

@app.route('/predict/loan', methods=['POST'])
def predict_loan():
    try:
        data = request.get_json()
    except:
        return {"error": "No data provided"}, 400
    
    try:
        # Extract quiz answers and car price
        income_annum = float(data.get("annualIncome", 0))
        credit_score = int(data.get("creditScore", 0))
        is_college_grad = 1 if data.get("isCollegeGrad") else 0
        is_self_employed = 1 if data.get("isSelfEmployed") else 0
        loan_amount = float(data.get("loanAmount", 0))  # Car MSRP
        loan_term = int(data.get("loanTerm", 5))  # Default 5 years
        
        # Import prediction function
        from predict_loan import predict_loan_approval
        
        # Make prediction
        result = predict_loan_approval(
            income_annum=income_annum,
            loan_amount=loan_amount,
            loan_term=loan_term,
            cibil_score=credit_score,
            education=is_college_grad,
            self_employed=is_self_employed
        )
        
        return result, 200
    except Exception as e:
        print(f"Error in loan prediction: {e}")
        return {"error": str(e)}, 500



if __name__ == '__main__':
    app.run(debug=True, port=5001)

    # DEBUG