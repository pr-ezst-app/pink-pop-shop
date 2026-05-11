import json
import os

def handler(event: dict, context) -> dict:
    """Save a new order to the database."""
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': {'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type', 'Access-Control-Max-Age': '86400'}, 'body': ''}

    body = json.loads(event.get('body', '{}'))

    first_name = body.get('first_name', '').strip()
    last_name = body.get('last_name', '').strip()
    email = body.get('email', '').strip()
    phone = body.get('phone', '').strip()
    street = body.get('street', '').strip()
    city = body.get('city', '').strip()
    state = body.get('state', '').strip()
    zip_code = body.get('zip', '').strip()
    items = body.get('items', [])
    total = body.get('total', 0)

    if not all([first_name, last_name, email, street, city, state, zip_code, items]):
        return {'statusCode': 400, 'headers': {'Access-Control-Allow-Origin': '*'}, 'body': json.dumps({'error': 'Please fill in all required fields.'})}

    import psycopg2
    schema = os.environ.get('MAIN_DB_SCHEMA', 'public')
    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor()
    items_json = json.dumps(items)
    cur.execute(
        "INSERT INTO " + schema + ".orders (first_name, last_name, email, phone, street, city, state, zip, items, total) VALUES ('" +
        first_name.replace("'","''") + "','" + last_name.replace("'","''") + "','" + email.replace("'","''") + "','" +
        phone.replace("'","''") + "','" + street.replace("'","''") + "','" + city.replace("'","''") + "','" +
        state.replace("'","''") + "','" + zip_code.replace("'","''") + "','" + items_json.replace("'","''") + "'," +
        str(float(total)) + ") RETURNING id"
    )
    order_id = cur.fetchone()[0]
    conn.commit()
    cur.close()
    conn.close()

    return {
        'statusCode': 200,
        'headers': {'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'success': True, 'order_id': order_id})
    }
