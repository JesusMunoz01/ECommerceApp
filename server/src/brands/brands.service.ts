import { Injectable } from '@nestjs/common';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { AppService } from 'src/app.service';

@Injectable()
export class BrandsService {
  constructor(private appService: AppService) {}
  private connection = this.appService.connection;

  async create(createBrandDto: CreateBrandDto, ownerId: string) {
    try {
      const result: any = await new Promise((resolve, reject) => {
        this.connection.query('INSERT INTO brands (name, description, image, brandOwner, created_at, updated_at) VALUES (?, ?, ?, ?, NOW(), NOW())', 
          [createBrandDto.name, createBrandDto.description, createBrandDto.image, ownerId.split('|')[1]], (err, results) => {
          if (err) {
            console.log(err);
            reject(err);
            return;
          }
          resolve(results);
        })
      });

      const brandId = result.insertId; 
      
      await this.addProducts(brandId, ownerId.split('|')[1], createBrandDto.products);
      
      return { message: 'Brand page created successfully', data: createBrandDto}
    } catch (error) {
      console.log(error)
      return { message: 'Error creating brand page', data: error}
    }
  }

  async findAll() {
    try {
      const result = await new Promise((resolve, reject) => {
        this.connection.query('SELECT * FROM brands', (err, results) => {
          if (err) {
            console.log(err);
            reject(err);
            return;
          }
          resolve(results);
        });
      });
      
      return { message: 'Brand page found successfully', data: result };
    } catch (error) {
      console.log(error);
      return { message: 'Error finding brand page', data: error };
    }
  }
  

  async findOne(id: number) {
    try {
      const result: [] = await new Promise((resolve, reject) => {
        this.connection.query('SELECT * FROM brands WHERE id = ?', [id], (err, results) => {
          if (err) {
            console.log(err);
            reject(err);
            return;
          }
          resolve(results[0]);
        });
      });

      if (!result || result.length === 0) {
        throw new Error('Brand page not found');
      }

        // Get products for brand
        const products = await new Promise((resolve, reject) => {
          this.connection.query('SELECT * FROM products WHERE brandId = ?', [id], (err, results) => {
            if (err) {
              console.log(err);
              reject(err);
              return;
            }
            resolve(results);
          });
        });

      return { message: 'Brand page found successfully', brand: result, products: products};
    } catch (error) {
      return { message: 'Error finding brand page', error: error.message || error };
    }
  }

  async findByOwner(ownerId: string) {
    try {
      const result: [] = await new Promise((resolve, reject) => {
        this.connection.query('SELECT * FROM brands WHERE brandOwner = ?', [ownerId], (err, results) => {
          if (err) {
            console.log(err);
            reject(err);
            return;
          }
          resolve(results);
        });
      });

      if (!result || result.length === 0) {
        throw new Error('Brand page not found');
      }

      return { message: 'Brand pages found successfully', brands: result};
    } catch (error) {
      return { message: 'Error finding brand page', error: error.message || error };
    }
  }

  async findUserBrandProducts(bid: number, uid: string) {
    try {
      const result: [] = await new Promise((resolve, reject) => {
        this.connection.query('SELECT * FROM products WHERE brandId = ? and ownerId = ?', [bid, uid], (err, results) => {
          if (err) {
            console.log(err);
            reject(err);
            return;
          }
          resolve(results);
        });
      });

      if (!result || result.length === 0) {
        throw new Error('Products not found');
      }

      return { message: 'Brand products found successfully', products: result};
    } catch (error) {
      return { message: 'Error finding brand page', error: error.message || error };
    }
  }

  async update(id: number, updateBrandDto: UpdateBrandDto, uid: string) {
    try {
      let setClause = [];
      let queryParams = [];

      console.log(updateBrandDto)
  
      // Dynamically build the SET part of the SQL query
      if (updateBrandDto.name !== '') {
        setClause.push('name = ?');
        queryParams.push(updateBrandDto.name);
      }
      if (updateBrandDto.description !== '') {
        setClause.push('description = ?');
        queryParams.push(updateBrandDto.description);
      }
      if (updateBrandDto.image !== '') {
        setClause.push('image = ?');
        queryParams.push(updateBrandDto.image);
      }
  
      // Ensure there's at least one field to update
      if (setClause.length === 0) {
        throw new Error('No valid fields provided for update');
      }
  
      // Add the current timestamp to the updated_at field
      setClause.push('updated_at = NOW()');
  
      // Add the WHERE clause parameter
      queryParams.push(id);
  
      // Construct the full SQL query
      const sqlQuery = `UPDATE brands SET ${setClause.join(', ')} WHERE id = ?`;
  
      // Execute the query
      await this.connection.query(sqlQuery, queryParams);
      return { message: 'Brand page updated successfully', data: updateBrandDto }
    } catch (error) {
      console.log(error)
      return { message: 'Error updating brand page', data: error }
    }
  }

  async addProducts(id: number, uid: string, products: number[]) {
    try{
      // Insert into ProductBrands junction table, the brandId and productIds
      const formattedProducts = products.map((product) => [id, product, uid]);
      await this.connection.query('INSERT INTO productbrand (brandId, productId, ownerId) VALUES ?', [formattedProducts]);
      return { message: 'Products added successfully', data: products}
    }
    catch (error) {
      console.log(error)
      return { message: 'Error adding products', data: error}
    }
  }

  async remove(id: number) {
    try {
      await this.connection.query('DELETE FROM brands WHERE id = ?', [id]);
      return { message: 'Brand page deleted successfully', data: id}
    } catch (error) {
      console.log(error)
      return { message: 'Error deleting brand page', data: error}
    }
  }

  async removeProducts(uid: string, products: number[]) {
    try{
      const formattedProducts = products.map((product) => `${product}`).join(',');
      await this.connection.query('UPDATE products SET brandId = NULL WHERE id IN (?) AND ownerId = ?', [formattedProducts, uid]);
      return { message: 'Products removed successfully', data: products}
    }
    catch (error) {
      console.log(error)
      return { message: 'Error removing products', data: error}
    }
  }
}
