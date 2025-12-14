import request from 'supertest';
import createApp from '../app';
import User, { UserRole } from '../models/User';
import Sweet, { SweetCategory } from '../models/Sweet';

const app = createApp();

describe('Sweet Controller', () => {
  let adminToken: string;
  let userToken: string;

  beforeEach(async () => {
    // Create admin user and get token
    const adminResponse = await request(app).post('/api/auth/register').send({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'password123',
      role: 'admin'
    });
    adminToken = adminResponse.body.data.token;

    // Create regular user and get token
    const userResponse = await request(app).post('/api/auth/register').send({
      name: 'Regular User',
      email: 'user@example.com',
      password: 'password123'
    });
    userToken = userResponse.body.data.token;
  });

  describe('POST /api/sweets', () => {
    const validSweet = {
      name: 'Chocolate Truffle',
      category: 'chocolate',
      price: 5.99,
      quantity: 100,
      description: 'Delicious chocolate truffle'
    };

    it('should create a sweet successfully as admin', async () => {
      const response = await request(app)
        .post('/api/sweets')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(validSweet)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe(validSweet.name);
      expect(response.body.data.category).toBe(validSweet.category);
      expect(response.body.data.price).toBe(validSweet.price);
      expect(response.body.data.quantity).toBe(validSweet.quantity);
    });

    it('should fail to create sweet as regular user', async () => {
      const response = await request(app)
        .post('/api/sweets')
        .set('Authorization', `Bearer ${userToken}`)
        .send(validSweet)
        .expect(403);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Admin access required');
    });

    it('should fail to create sweet without authentication', async () => {
      const response = await request(app)
        .post('/api/sweets')
        .send(validSweet)
        .expect(401);

      expect(response.body.success).toBe(false);
    });

    it('should fail to create sweet with invalid data', async () => {
      const invalidSweet = {
        name: 'A', // Too short
        category: 'invalid', // Invalid category
        price: -5, // Negative price
        quantity: -10 // Negative quantity
      };

      const response = await request(app)
        .post('/api/sweets')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(invalidSweet)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.errors).toBeDefined();
    });
  });

  describe('GET /api/sweets', () => {
    beforeEach(async () => {
      // Create some test sweets
      await Sweet.create([
        {
          name: 'Chocolate Bar',
          category: SweetCategory.CHOCOLATE,
          price: 2.99,
          quantity: 50
        },
        {
          name: 'Vanilla Cookie',
          category: SweetCategory.COOKIE,
          price: 1.99,
          quantity: 100
        },
        {
          name: 'Strawberry Cake',
          category: SweetCategory.CAKE,
          price: 15.99,
          quantity: 10
        }
      ]);
    });

    it('should get all sweets for authenticated user', async () => {
      const response = await request(app)
        .get('/api/sweets')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.count).toBe(3);
      expect(response.body.data).toHaveLength(3);
    });

    it('should fail to get sweets without authentication', async () => {
      const response = await request(app).get('/api/sweets').expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/sweets/search', () => {
    beforeEach(async () => {
      await Sweet.create([
        {
          name: 'Dark Chocolate',
          category: SweetCategory.CHOCOLATE,
          price: 5.99,
          quantity: 50
        },
        {
          name: 'Milk Chocolate',
          category: SweetCategory.CHOCOLATE,
          price: 4.99,
          quantity: 75
        },
        {
          name: 'Sugar Cookie',
          category: SweetCategory.COOKIE,
          price: 1.99,
          quantity: 100
        },
        {
          name: 'Expensive Cake',
          category: SweetCategory.CAKE,
          price: 25.99,
          quantity: 5
        }
      ]);
    });

    it('should search by name', async () => {
      const response = await request(app)
        .get('/api/sweets/search')
        .query({ name: 'chocolate' })
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.count).toBe(2);
    });

    it('should search by category', async () => {
      const response = await request(app)
        .get('/api/sweets/search')
        .query({ category: 'cookie' })
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.count).toBe(1);
      expect(response.body.data[0].name).toBe('Sugar Cookie');
    });

    it('should search by price range', async () => {
      const response = await request(app)
        .get('/api/sweets/search')
        .query({ minPrice: 5, maxPrice: 10 })
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.count).toBe(1);
      expect(response.body.data[0].name).toBe('Dark Chocolate');
    });

    it('should search with combined filters', async () => {
      const response = await request(app)
        .get('/api/sweets/search')
        .query({ category: 'chocolate', maxPrice: 5 })
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.count).toBe(1);
      expect(response.body.data[0].name).toBe('Milk Chocolate');
    });
  });

  describe('PUT /api/sweets/:id', () => {
    let sweetId: string;

    beforeEach(async () => {
      const sweet = await Sweet.create({
        name: 'Original Sweet',
        category: SweetCategory.CANDY,
        price: 3.99,
        quantity: 50
      });
      sweetId = sweet._id.toString();
    });

    it('should update sweet as admin', async () => {
      const response = await request(app)
        .put(`/api/sweets/${sweetId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Updated Sweet',
          price: 4.99
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe('Updated Sweet');
      expect(response.body.data.price).toBe(4.99);
    });

    it('should fail to update as regular user', async () => {
      const response = await request(app)
        .put(`/api/sweets/${sweetId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ name: 'Updated Sweet' })
        .expect(403);

      expect(response.body.success).toBe(false);
    });

    it('should return 404 for non-existent sweet', async () => {
      const response = await request(app)
        .put('/api/sweets/507f1f77bcf86cd799439011')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ name: 'Updated Sweet' })
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Sweet not found');
    });
  });

  describe('DELETE /api/sweets/:id', () => {
    let sweetId: string;

    beforeEach(async () => {
      const sweet = await Sweet.create({
        name: 'Sweet to Delete',
        category: SweetCategory.CANDY,
        price: 2.99,
        quantity: 25
      });
      sweetId = sweet._id.toString();
    });

    it('should delete sweet as admin', async () => {
      const response = await request(app)
        .delete(`/api/sweets/${sweetId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Sweet deleted successfully');

      // Verify deletion
      const sweet = await Sweet.findById(sweetId);
      expect(sweet).toBeNull();
    });

    it('should fail to delete as regular user', async () => {
      const response = await request(app)
        .delete(`/api/sweets/${sweetId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(403);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Admin access required');
    });
  });

  describe('POST /api/sweets/:id/purchase', () => {
    let sweetId: string;

    beforeEach(async () => {
      const sweet = await Sweet.create({
        name: 'Purchasable Sweet',
        category: SweetCategory.CANDY,
        price: 2.99,
        quantity: 10
      });
      sweetId = sweet._id.toString();
    });

    it('should purchase sweet successfully', async () => {
      const response = await request(app)
        .post(`/api/sweets/${sweetId}/purchase`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ quantity: 2 })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.quantity).toBe(8);
    });

    it('should fail to purchase more than available', async () => {
      const response = await request(app)
        .post(`/api/sweets/${sweetId}/purchase`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ quantity: 15 })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Insufficient stock');
    });

    it('should default to quantity 1 if not specified', async () => {
      const response = await request(app)
        .post(`/api/sweets/${sweetId}/purchase`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({})
        .expect(200);

      expect(response.body.data.quantity).toBe(9);
    });
  });

  describe('POST /api/sweets/:id/restock', () => {
    let sweetId: string;

    beforeEach(async () => {
      const sweet = await Sweet.create({
        name: 'Restockable Sweet',
        category: SweetCategory.CANDY,
        price: 2.99,
        quantity: 10
      });
      sweetId = sweet._id.toString();
    });

    it('should restock sweet as admin', async () => {
      const response = await request(app)
        .post(`/api/sweets/${sweetId}/restock`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ quantity: 50 })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.quantity).toBe(60);
    });

    it('should fail to restock as regular user', async () => {
      const response = await request(app)
        .post(`/api/sweets/${sweetId}/restock`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ quantity: 50 })
        .expect(403);

      expect(response.body.success).toBe(false);
    });

    it('should fail to restock with invalid quantity', async () => {
      const response = await request(app)
        .post(`/api/sweets/${sweetId}/restock`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ quantity: -10 })
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });
});
