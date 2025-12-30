import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor

def handler(event: dict, context) -> dict:
    '''API для управления товарами цветочного магазина'''
    
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Token'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    dsn = os.environ.get('DATABASE_URL')
    conn = psycopg2.connect(dsn)
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    
    try:
        if method == 'GET':
            show_all = event.get('queryStringParameters', {}).get('all') == 'true'
            
            if show_all:
                cursor.execute('SELECT * FROM products ORDER BY created_at DESC')
            else:
                cursor.execute('SELECT * FROM products WHERE is_available = true ORDER BY created_at DESC')
            
            products = cursor.fetchall()
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps([dict(p) for p in products], default=str),
                'isBase64Encoded': False
            }
        
        headers = event.get('headers', {})
        admin_token = headers.get('X-Admin-Token') or headers.get('x-admin-token')
        
        if not admin_token or admin_token != os.environ.get('ADMIN_SECRET'):
            return {
                'statusCode': 403,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'Доступ запрещен'}),
                'isBase64Encoded': False
            }
        
        if method == 'POST':
            data = json.loads(event.get('body', '{}'))
            
            cursor.execute(
                '''INSERT INTO products (name, price, category, image_url, description, composition, is_available)
                   VALUES (%s, %s, %s, %s, %s, %s, %s) RETURNING *''',
                (data['name'], data['price'], data['category'], data.get('image_url'), 
                 data.get('description'), data.get('composition'), data.get('is_available', True))
            )
            conn.commit()
            
            product = cursor.fetchone()
            
            return {
                'statusCode': 201,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps(dict(product), default=str),
                'isBase64Encoded': False
            }
        
        if method == 'PUT':
            data = json.loads(event.get('body', '{}'))
            product_id = data.get('id')
            
            if not product_id:
                return {
                    'statusCode': 400,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({'error': 'ID товара обязателен'}),
                    'isBase64Encoded': False
                }
            
            cursor.execute(
                '''UPDATE products 
                   SET name = %s, price = %s, category = %s, image_url = %s, 
                       description = %s, composition = %s, is_available = %s, updated_at = CURRENT_TIMESTAMP
                   WHERE id = %s RETURNING *''',
                (data['name'], data['price'], data['category'], data.get('image_url'),
                 data.get('description'), data.get('composition'), data.get('is_available', True), product_id)
            )
            conn.commit()
            
            product = cursor.fetchone()
            
            if not product:
                return {
                    'statusCode': 404,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({'error': 'Товар не найден'}),
                    'isBase64Encoded': False
                }
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps(dict(product), default=str),
                'isBase64Encoded': False
            }
        
        if method == 'DELETE':
            params = event.get('queryStringParameters', {})
            product_id = params.get('id')
            
            if not product_id:
                return {
                    'statusCode': 400,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({'error': 'ID товара обязателен'}),
                    'isBase64Encoded': False
                }
            
            cursor.execute('DELETE FROM products WHERE id = %s', (product_id,))
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'success': True}),
                'isBase64Encoded': False
            }
        
        return {
            'statusCode': 405,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Метод не поддерживается'}),
            'isBase64Encoded': False
        }
    
    finally:
        cursor.close()
        conn.close()
