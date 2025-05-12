import asyncio
import motor.motor_asyncio
from datetime import datetime

# MongoDB connection
client = motor.motor_asyncio.AsyncIOMotorClient('mongodb://localhost:27017')
db = client.building_rules_db
simple_building_rules = db.simple_building_rules

# Sample building rules
sample_rules = [
    {
        "cityName": "Bangalore",
        "pincode": "560004",
        "status": "active",
        "createdAt": datetime.utcnow(),
        "updatedAt": datetime.utcnow(),
        "rules": [
            {
                "roomType": "bedroom",
                "description": "Minimum requirements for bedrooms",
                "dimensions": {
                    "minArea": 120,
                    "maxArea": 250,
                    "minWidth": 10,
                    "maxWidth": 20,
                    "unit": "sq feet"
                },
                "additionalRequirements": "Must have natural ventilation"
            },
            {
                "roomType": "bathroom/toilet",
                "description": "Minimum requirements for bathrooms",
                "dimensions": {
                    "minArea": 45,
                    "maxArea": 100,
                    "minWidth": 6,
                    "maxWidth": 12,
                    "unit": "sq feet"
                },
                "additionalRequirements": "Must have proper drainage"
            },
            {
                "roomType": "hall",
                "description": "Minimum requirements for living hall",
                "dimensions": {
                    "minArea": 150,
                    "maxArea": 400,
                    "minWidth": 12,
                    "maxWidth": 25,
                    "unit": "sq feet"
                },
                "additionalRequirements": "Must have cross ventilation"
            },
            {
                "roomType": "kitchen",
                "description": "Minimum requirements for kitchen",
                "dimensions": {
                    "minArea": 60,
                    "maxArea": 150,
                    "minWidth": 8,
                    "maxWidth": 15,
                    "unit": "sq feet"
                },
                "additionalRequirements": "Must have exhaust fan provision"
            }
        ]
    },
    {
        "cityName": "Mumbai",
        "pincode": "400001",
        "status": "active",
        "createdAt": datetime.utcnow(),
        "updatedAt": datetime.utcnow(),
        "rules": [
            {
                "roomType": "bedroom",
                "description": "Minimum requirements for bedrooms",
                "dimensions": {
                    "minArea": 150,
                    "maxArea": 300,
                    "minWidth": 12,
                    "maxWidth": 25,
                    "unit": "sq feet"
                },
                "additionalRequirements": "Must have natural ventilation"
            },
            {
                "roomType": "bathroom/toilet",
                "description": "Minimum requirements for bathrooms",
                "dimensions": {
                    "minArea": 50,
                    "maxArea": 120,
                    "minWidth": 7,
                    "maxWidth": 15,
                    "unit": "sq feet"
                },
                "additionalRequirements": "Must have proper drainage"
            },
            {
                "roomType": "hall",
                "description": "Minimum requirements for living hall",
                "dimensions": {
                    "minArea": 200,
                    "maxArea": 500,
                    "minWidth": 15,
                    "maxWidth": 30,
                    "unit": "sq feet"
                },
                "additionalRequirements": "Must have cross ventilation"
            },
            {
                "roomType": "kitchen",
                "description": "Minimum requirements for kitchen",
                "dimensions": {
                    "minArea": 70,
                    "maxArea": 180,
                    "minWidth": 9,
                    "maxWidth": 18,
                    "unit": "sq feet"
                },
                "additionalRequirements": "Must have exhaust fan provision"
            }
        ]
    }
]

async def insert_rules():
    try:
        # Clear existing rules
        await simple_building_rules.delete_many({})
        
        # Insert new rules
        result = await simple_building_rules.insert_many(sample_rules)
        print(f"Successfully inserted {len(result.inserted_ids)} building rules")
        
        # Verify insertion
        count = await simple_building_rules.count_documents({})
        print(f"Total rules in database: {count}")
        
    except Exception as e:
        print(f"Error inserting rules: {str(e)}")
    finally:
        client.close()

if __name__ == "__main__":
    asyncio.run(insert_rules()) 