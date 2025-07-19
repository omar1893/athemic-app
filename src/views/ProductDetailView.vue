<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <div class="product-detail-container">
        <!-- Header -->
        <div class="header">
          <q-btn flat round icon="arrow_back" @click="goBack" class="header-btn" />
          <q-btn flat round icon="shopping_cart" @click="goToCart" class="header-btn" />
        </div>

        <!-- Loading state -->
        <div v-if="loading" class="loading-container">
          <ion-spinner name="crescent"></ion-spinner>
          <p>Loading product...</p>
        </div>

        <!-- Error state -->
        <div v-else-if="error" class="error-container">
          <p>{{ error }}</p>
          <q-btn color="primary" @click="fetchProduct">Try Again</q-btn>
        </div>

        <!-- Product content -->
        <div v-else-if="product" class="product-content">
          <!-- Product image section -->
          <div class="product-image-section">
            <div class="product-image-container">
              <div class="product-image-placeholder">
                <q-icon name="image" size="120px" color="grey-5" />
              </div>
            </div>
            <!-- Image carousel indicators -->
            <div class="image-indicators">
              <div class="indicator active"></div>
              <div class="indicator"></div>
              <div class="indicator"></div>
            </div>
          </div>

          <!-- Product info section -->
          <div class="product-info-section">
            <div class="price-section">
              <span class="price">${{ product.precio }}</span>
            </div>
            
            <h1 class="product-name">{{ product.nombre }}</h1>
            
            <p class="product-description">
              Pan dulce esponjoso con cobertura de azúcar en verde, blanco y rojo.
            </p>
            
            <p class="product-context">
              Un ícono del pan mexicano, ideal para acompañar con café.
            </p>

            <!-- Seller info -->
            <div class="seller-info">
              <div class="seller-icon">
                <q-icon name="location_on" color="red" size="16px" />
              </div>
              <span class="seller-name">Sweet Roots</span>
            </div>
          </div>

          <!-- Most ordered section -->
          <div class="most-ordered-section">
            <h3 class="section-title">Most ordered</h3>
            <div class="products-carousel">
              <div class="product-card" v-for="i in 3" :key="i">
                <div class="card-image-placeholder">
                  <q-icon name="image" size="32px" color="grey-5" />
                </div>
                <div class="card-content">
                  <div class="card-price">$13,00</div>
                  <div class="card-name">Tortillas de Maíz Artesanales</div>
                  <div class="card-seller">Sweet Roots</div>
                </div>
                <q-btn round flat icon="add" class="card-add-btn" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Fixed bottom bar -->
      <div v-if="product && !loading && !error" class="bottom-bar">
        <div class="quantity-selector">
          <q-btn 
            round 
            flat 
            icon="remove" 
            @click="decreaseQuantity"
            :disable="quantity <= 1"
            class="quantity-btn"
          />
          <span class="quantity">{{ quantity }}</span>
          <q-btn 
            round 
            flat 
            icon="add" 
            @click="increaseQuantity"
            class="quantity-btn"
          />
        </div>
        
        <q-btn
          color="primary"
          class="add-to-cart-btn"
          :loading="addingToCart"
          :disable="addingToCart || !product.isActive"
          @click="addToCart"
          :label="`Add $${product.precio}`"
        />
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonContent, IonPage, IonSpinner } from '@ionic/vue';
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import productsService from '@/services/products.service';
import interactionsService from '@/services/interactions.service';

interface Product {
  id: string;
  nombre: string;
  precio: number;
  isActive: boolean;
  contadorCarrito: number;
}

const route = useRoute();
const router = useRouter();

const product = ref<Product | null>(null);
const loading = ref(true);
const error = ref('');
const quantity = ref(1);
const addingToCart = ref(false);

const productId = route.params.id as string;

const fetchProduct = async () => {
  try {
    loading.value = true;
    error.value = '';
    
    // Fetch all products and find the specific one by ID
    const response = await productsService.getAll();
    
    if (response.productos && response.productos.length > 0) {
      const foundProduct = response.productos.find((p: any) => p.id === productId);
      
      if (foundProduct) {
        product.value = foundProduct;
        console.log('Product loaded successfully:', product.value);
        
        // Track vista interaction
        try {
          console.log('About to track vista interaction...');
          await interactionsService.addInteraction({
            productId: productId,
            tipo: 'vista'
          });
          console.log('Vista interaction tracked successfully');
        } catch (interactionError) {
          console.error('Error tracking vista interaction:', interactionError);
        }
        
      } else {
        error.value = 'Product not found';
      }
    } else {
      error.value = 'No products available';
    }
  } catch (err) {
    console.error('Error fetching product:', err);
    error.value = 'Error loading product. Please try again.';
  } finally {
    loading.value = false;
  }
};

const increaseQuantity = () => {
  quantity.value++;
};

const decreaseQuantity = () => {
  if (quantity.value > 1) {
    quantity.value--;
  }
};

const addToCart = async () => {
  console.log('addToCart called with productId:', productId);
  console.log('Quantity:', quantity.value);
  
  try {
    addingToCart.value = true;
    
    console.log('About to track carrito interaction...');
    // Track carrito interaction
    await interactionsService.addInteraction({
      productId: productId,
      tipo: 'carrito'
    });
    console.log('Carrito interaction tracked successfully');
    
    console.log('About to increment cart...');
    // Add to cart multiple times based on quantity
    for (let i = 0; i < quantity.value; i++) {
      await interactionsService.incrementCart(productId);
    }
    
    // Show success message or navigate to cart
    console.log(`Added ${quantity.value} item(s) to cart successfully`);
    
  } catch (err) {
    console.error('Error in addToCart:', err);
  } finally {
    addingToCart.value = false;
  }
};

const goBack = () => {
  router.back();
};

const goToCart = () => {
  // Navigate to cart view (you can implement this later)
  console.log('Navigate to cart');
};

onMounted(() => {
  if (productId) {
    fetchProduct();
  } else {
    error.value = 'No product ID provided';
    loading.value = false;
  }
});
</script>

<style lang="scss" scoped>
.product-detail-container {
  max-width: 480px;
  margin: 0 auto;
  min-height: 100vh;
  background: #f8f9fa;
  position: relative;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.6rem;
  background: white;
  
  .header-btn {
    background: #875EF8;
    color: white;
    width: 40px;
    height: 40px;
  }
}

.loading-container,
.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 50vh;
  gap: 1rem;
  
  p {
    font-size: 1.6rem;
    color: #666;
  }
}

.product-content {
  background: white;
  margin: 0 1.6rem;
  border-radius: 1.2rem;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.product-image-section {
  position: relative;
  
  .product-image-container {
    width: 100%;
    height: 300px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f5f5f5;
  }
  
  .image-indicators {
    display: flex;
    justify-content: center;
    gap: 0.8rem;
    padding: 1rem 0;
    
    .indicator {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #d1d5db;
      
      &.active {
        background: #6b7280;
      }
    }
  }
}

.product-info-section {
  padding: 2rem;
  
  .price-section {
    margin-bottom: 1rem;
    
    .price {
      font-size: 2.4rem;
      font-weight: 700;
      color: #170033;
    }
  }
  
  .product-name {
    font-size: 2rem;
    font-weight: 700;
    color: #170033;
    margin: 0 0 1rem 0;
    line-height: 1.2;
  }
  
  .product-description {
    font-size: 1.6rem;
    color: #374151;
    line-height: 1.5;
    margin: 0 0 1rem 0;
  }
  
  .product-context {
    font-size: 1.4rem;
    color: #6b7280;
    line-height: 1.4;
    margin: 0 0 1.5rem 0;
  }
  
  .seller-info {
    display: flex;
    align-items: center;
    gap: 0.8rem;
    
    .seller-icon {
      width: 24px;
      height: 24px;
      background: #ef4444;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .seller-name {
      font-size: 1.4rem;
      color: #170033;
      font-weight: 500;
    }
  }
}

.most-ordered-section {
  padding: 0 2rem 2rem;
  
  .section-title {
    font-size: 1.8rem;
    font-weight: 700;
    color: #170033;
    margin: 0 0 1.5rem 0;
  }
  
  .products-carousel {
    display: flex;
    gap: 1.2rem;
    overflow-x: auto;
    padding-bottom: 0.5rem;
    
    .product-card {
      min-width: 160px;
      background: white;
      border-radius: 1.2rem;
      padding: 1rem;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      position: relative;
      
      .card-image-placeholder {
        width: 100%;
        height: 80px;
        background: #f5f5f5;
        border-radius: 0.8rem;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 0.8rem;
      }
      
      .card-content {
        .card-price {
          font-size: 1.4rem;
          font-weight: 700;
          color: #170033;
          margin-bottom: 0.4rem;
        }
        
        .card-name {
          font-size: 1.2rem;
          color: #374151;
          font-weight: 500;
          margin-bottom: 0.4rem;
          line-height: 1.3;
        }
        
        .card-seller {
          font-size: 1rem;
          color: #6b7280;
        }
      }
      
      .card-add-btn {
        position: absolute;
        top: 0.8rem;
        right: 0.8rem;
        background: #875EF8;
        color: white;
        width: 32px;
        height: 32px;
      }
    }
  }
}

.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  padding: 1.6rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.6rem;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.1);
  max-width: 480px;
  margin: 0 auto;
  
  .quantity-selector {
    display: flex;
    align-items: center;
    gap: 1.2rem;
    
    .quantity-btn {
      background: #e5e7eb;
      color: #374151;
      width: 40px;
      height: 40px;
      
      &:disabled {
        opacity: 0.5;
      }
    }
    
    .quantity {
      font-size: 1.8rem;
      font-weight: 600;
      color: #170033;
      min-width: 3rem;
      text-align: center;
    }
  }
  
  .add-to-cart-btn {
    flex: 1;
    height: 5.6rem;
    font-size: 1.6rem;
    font-weight: 600;
    border-radius: 1.2rem;
    background: #875EF8;
  }
}

// Add padding to content to account for fixed bottom bar
ion-content {
  --padding-bottom: 9rem;
}
</style> 