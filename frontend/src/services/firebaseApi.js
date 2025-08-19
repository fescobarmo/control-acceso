import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../config/firebase';

// Generic CRUD operations for Firebase collections
class FirebaseAPI {
  constructor(collectionName) {
    this.collectionName = collectionName;
    this.collectionRef = collection(db, collectionName);
  }

  // Get all documents
  async getAll(options = {}) {
    try {
      let q = this.collectionRef;
      
      // Apply where conditions
      if (options.where) {
        options.where.forEach(condition => {
          q = query(q, where(condition.field, condition.operator, condition.value));
        });
      }
      
      // Apply ordering
      if (options.orderBy) {
        q = query(q, orderBy(options.orderBy.field, options.orderBy.direction || 'asc'));
      }
      
      // Apply limit
      if (options.limit) {
        q = query(q, limit(options.limit));
      }
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error(`Error getting ${this.collectionName}:`, error);
      throw error;
    }
  }

  // Get document by ID
  async getById(id) {
    try {
      const docRef = doc(db, this.collectionName, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data()
        };
      } else {
        throw new Error(`Document with ID ${id} not found`);
      }
    } catch (error) {
      console.error(`Error getting ${this.collectionName} by ID:`, error);
      throw error;
    }
  }

  // Create new document
  async create(data) {
    try {
      const docData = {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      
      const docRef = await addDoc(this.collectionRef, docData);
      return {
        id: docRef.id,
        ...docData
      };
    } catch (error) {
      console.error(`Error creating ${this.collectionName}:`, error);
      throw error;
    }
  }

  // Update document
  async update(id, data) {
    try {
      const docRef = doc(db, this.collectionName, id);
      const updateData = {
        ...data,
        updatedAt: serverTimestamp()
      };
      
      await updateDoc(docRef, updateData);
      return {
        id,
        ...updateData
      };
    } catch (error) {
      console.error(`Error updating ${this.collectionName}:`, error);
      throw error;
    }
  }

  // Delete document
  async delete(id) {
    try {
      const docRef = doc(db, this.collectionName, id);
      await deleteDoc(docRef);
      return id;
    } catch (error) {
      console.error(`Error deleting ${this.collectionName}:`, error);
      throw error;
    }
  }

  // Search documents
  async search(field, value) {
    try {
      const q = query(this.collectionRef, where(field, '==', value));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error(`Error searching ${this.collectionName}:`, error);
      throw error;
    }
  }
}

// Create API instances for each collection
export const usersAPI = new FirebaseAPI('users');
export const residentesAPI = new FirebaseAPI('residentes');
export const visitasAPI = new FirebaseAPI('visitas');
export const visitasExternasAPI = new FirebaseAPI('visitasExternas');
export const accessLogsAPI = new FirebaseAPI('accessLogs');
export const areasAPI = new FirebaseAPI('areas');
export const devicesAPI = new FirebaseAPI('devices');
export const profilesAPI = new FirebaseAPI('profiles');

// Specific API methods for complex operations
export const visitasService = {
  // Get visits by resident
  async getByResident(residenteId) {
    return visitasAPI.getAll({
      where: [{ field: 'residenteId', operator: '==', value: residenteId }],
      orderBy: { field: 'fechaHora', direction: 'desc' }
    });
  },

  // Get recent visits
  async getRecent(limitCount = 10) {
    return visitasAPI.getAll({
      orderBy: { field: 'fechaHora', direction: 'desc' },
      limit: limitCount
    });
  }
};

export const visitasExternasService = {
  // Get visits by status
  async getByStatus(status) {
    return visitasExternasAPI.getAll({
      where: [{ field: 'estado', operator: '==', value: status }],
      orderBy: { field: 'fechaHora', direction: 'desc' }
    });
  },

  // Get pending visits
  async getPending() {
    return this.getByStatus('pendiente');
  }
};

export const residentesService = {
  // Get resident by email
  async getByEmail(email) {
    const residents = await residentesAPI.search('email', email);
    return residents.length > 0 ? residents[0] : null;
  },

  // Get active residents
  async getActive() {
    return residentesAPI.getAll({
      where: [{ field: 'activo', operator: '==', value: true }]
    });
  }
};

export default FirebaseAPI;

