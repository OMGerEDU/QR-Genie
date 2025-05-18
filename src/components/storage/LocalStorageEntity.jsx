import React from 'react';

/**
 * A utility class that mimics the Entity API but uses localStorage
 */
class LocalStorageEntity {
  constructor(name) {
    this.name = name;
    this.storageKey = `local_entity_${name}`;
    
    // Initialize with empty array if not exists
    if (!localStorage.getItem(this.storageKey)) {
      localStorage.setItem(this.storageKey, '[]');
    }
  }

  // Generate a unique ID
  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // Get all items
  async list(sortBy = '-created_date', limit = null) {
    try {
      let items = JSON.parse(localStorage.getItem(this.storageKey) || '[]');
      
      // Sort items
      if (sortBy) {
        const desc = sortBy.startsWith('-');
        const field = desc ? sortBy.slice(1) : sortBy;
        items.sort((a, b) => {
          if (desc) {
            return b[field] > a[field] ? 1 : -1;
          }
          return a[field] > b[field] ? 1 : -1;
        });
      }

      // Apply limit
      if (limit) {
        items = items.slice(0, limit);
      }

      return items;
    } catch (error) {
      console.error(`Error listing ${this.name}:`, error);
      return [];
    }
  }

  // Create a new item
  async create(data) {
    try {
      const items = JSON.parse(localStorage.getItem(this.storageKey) || '[]');
      const newItem = {
        ...data,
        id: this.generateId(),
        created_date: new Date().toISOString(),
        updated_date: new Date().toISOString()
      };
      items.push(newItem);
      localStorage.setItem(this.storageKey, JSON.stringify(items));
      return newItem;
    } catch (error) {
      console.error(`Error creating ${this.name}:`, error);
      throw error;
    }
  }

  // Get an item by ID
  async get(id) {
    try {
      const items = JSON.parse(localStorage.getItem(this.storageKey) || '[]');
      const item = items.find(item => item.id === id);
      if (!item) {
        throw new Error(`${this.name} with ID ${id} not found`);
      }
      return item;
    } catch (error) {
      console.error(`Error getting ${this.name}:`, error);
      throw error;
    }
  }

  // Update an item
  async update(id, data) {
    try {
      const items = JSON.parse(localStorage.getItem(this.storageKey) || '[]');
      const index = items.findIndex(item => item.id === id);
      if (index === -1) {
        throw new Error(`${this.name} with ID ${id} not found`);
      }
      const updatedItem = {
        ...items[index],
        ...data,
        updated_date: new Date().toISOString()
      };
      items[index] = updatedItem;
      localStorage.setItem(this.storageKey, JSON.stringify(items));
      return updatedItem;
    } catch (error) {
      console.error(`Error updating ${this.name}:`, error);
      throw error;
    }
  }

  // Delete an item
  async delete(id) {
    try {
      const items = JSON.parse(localStorage.getItem(this.storageKey) || '[]');
      const filteredItems = items.filter(item => item.id !== id);
      localStorage.setItem(this.storageKey, JSON.stringify(filteredItems));
    } catch (error) {
      console.error(`Error deleting ${this.name}:`, error);
      throw error;
    }
  }

  // Filter items
  async filter(conditions, sortBy = '-created_date', limit = null) {
    try {
      let items = JSON.parse(localStorage.getItem(this.storageKey) || '[]');
      
      // Apply conditions
      items = items.filter(item => {
        return Object.entries(conditions).every(([key, value]) => item[key] === value);
      });

      // Sort items
      if (sortBy) {
        const desc = sortBy.startsWith('-');
        const field = desc ? sortBy.slice(1) : sortBy;
        items.sort((a, b) => {
          if (desc) {
            return b[field] > a[field] ? 1 : -1;
          }
          return a[field] > b[field] ? 1 : -1;
        });
      }

      // Apply limit
      if (limit) {
        items = items.slice(0, limit);
      }

      return items;
    } catch (error) {
      console.error(`Error filtering ${this.name}:`, error);
      return [];
    }
  }

  // Bulk create items
  async bulkCreate(items) {
    try {
      const existingItems = JSON.parse(localStorage.getItem(this.storageKey) || '[]');
      const newItems = items.map(item => ({
        ...item,
        id: this.generateId(),
        created_date: new Date().toISOString(),
        updated_date: new Date().toISOString()
      }));
      const updatedItems = [...existingItems, ...newItems];
      localStorage.setItem(this.storageKey, JSON.stringify(updatedItems));
      return newItems;
    } catch (error) {
      console.error(`Error bulk creating ${this.name}:`, error);
      throw error;
    }
  }
}

// Export a factory function to create LocalStorageEntity instances
export const createLocalStorageEntity = (name) => {
  return new LocalStorageEntity(name);
};