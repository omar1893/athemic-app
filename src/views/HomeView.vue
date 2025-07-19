<template>
    <ion-page>
        <ion-content :fullscreen="true">
            <div class="home-container text-dark">
                <!-- Header con dirección -->
                <div class="home-header">
                    <div class="address-title">Home <q-icon name="expand_more" /></div>
                    <div class="address-sub">1541 Notre-Dame St W</div>
                </div>

                <!-- Search bar y botones -->
                <div class="search-row">
                    <q-input 
                        v-model="searchQuery"
                        rounded 
                        placeholder="Search" 
                        class="search-input"
                        @update:model-value="handleSearch"
                    >
                        <template #prepend>
                            <img src="@/assets/imgs/big.svg" alt="search-icon">
                        </template>
                    </q-input>
                    <q-btn round flat class="search-btn" @click="goToCart">
                        <img src="@/assets/imgs/cart.svg" alt="cart-icon">
                    </q-btn>
                </div>

                <!-- Slider de promociones -->
                <div class="promo-slider">
                    <Carousel :items-to-show="1.3" :gap="10">
                        <Slide v-for="(slide, n) in promoSlides" :key="n">
                            <div class="promo-slide row no-wrap">
                                <div class="promo-slide-info" :style="{ backgroundColor: slide.accentColor }">
                                    <div class="promo-slide-title">{{ slide.title }}</div>
                                    <div class="promo-slide-description">{{ slide.description }}</div>
                                </div>
                                <div class="promo-slide-img">
                                    <img :src="slide.img" alt="promo-slide-img" />
                                </div>
                            </div>
                        </Slide>
                    </Carousel>
                </div>

                <!-- Categorías -->
                <div class="categories-row text-dark body-bold">
                    <div class="category-card retail" @click="filterByCategory('retail')">
                        <img src="@/assets/imgs/retails-icon.svg" alt="comida">
                        Retails
                    </div>
                    <div class="category-card market" @click="filterByCategory('market')">
                        <img src="@/assets/imgs/bag.svg" alt="mercado">
                        Mercado
                    </div>
                </div>

                <!-- Loading state -->
                <div v-if="loading" class="loading-container">
                    <ion-spinner name="crescent"></ion-spinner>
                    <p>Loading products...</p>
                </div>

                <!-- Most ordered -->
                <div v-else-if="bestSellers.length > 0" class="section-title body-bold">Most ordered</div>
                <Carousel v-if="!loading" :items-to-show="2.5" :gap="16" class="mb-2">
                    <Slide v-for="product in bestSellers" :key="product.id">
                        <div class="product-card" @click="goToProductDetail(product.id)">
                            <div class="product-img">
                                <img v-if="product.image" :src="product.image" :alt="product.name">
                                <div v-else class="product-placeholder">
                                    <q-icon name="image" size="24px" />
                                </div>
                            </div>
                            <div class="product-info">
                                <div class="product-price body-bold">${{ product.price }}</div>
                                <div class="product-name body-small">{{ product.name }}</div>
                                <div class="product-meta label">{{ product.store || 'Store' }}</div>
                            </div>
                            <q-btn round flat class="add-button" @click.stop="addToCart(product.id)">
                                <img src="@/assets/imgs/add.svg" alt="add-icon">
                            </q-btn>
                        </div>
                    </Slide>
                </Carousel>

                <!-- Recomendaciones -->
                <div v-if="recommendations.length > 0" class="section-title body-bold">Because you search "Mexican food"</div>
                <div class="products-list">
                    <div 
                        class="product-list-item" 
                        v-for="product in recommendations" 
                        :key="product.id"
                        @click="goToProductDetail(product.id)"
                    >
                        <div class="product-list-img">
                            <img v-if="product.image" :src="product.image" :alt="product.name">
                            <div v-else class="product-placeholder">
                                <q-icon name="image" size="24px" />
                            </div>
                        </div>
                        <div class="product-list-info">
                            <div class="product-list-name body-small">{{ product.name }}</div>
                            <div class="product-list-price subtitle-bold">${{ product.price }}</div>
                            <div class="product-list-meta label">{{ product.store || 'Store' }}</div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- Bottom nav (placeholder) -->
            <div class="bottom-nav">
                <q-btn flat icon="home" label="Home" />
                <q-btn flat icon="list_alt" label="My orders" />
                <q-btn flat icon="person" label="Profiles" />
            </div>
        </ion-content>
    </ion-page>
</template>

<script setup lang="ts">
import { IonContent, IonPage, IonSpinner } from '@ionic/vue';
import { Carousel, Slide } from 'vue3-carousel';
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import 'vue3-carousel/dist/carousel.css';
import comidaBanner from '@/assets/test/comida-banner.svg';
import productsService from '@/services/products.service';
import interactionsService from '@/services/interactions.service';

interface Product {
  id: string;
  name: string;
  price: number;
  image?: string;
  store?: string;
}

const router = useRouter();
const loading = ref(false);
const searchQuery = ref('');
const bestSellers = ref<Product[]>([]);
const recommendations = ref<Product[]>([]);

const promoSlides = [
  {
    title: '50% off',
    description: 'en productos',
    accentColor: '#FFE9C9',
    img: comidaBanner
  },
  {
    title: '25% off',
    description: 'en abarrotes',
    accentColor: '#E3F6FF',
    img: comidaBanner
  },
  {
    title: '2x1',
    description: 'en snacks',
    accentColor: '#F3E8FF',
    img: comidaBanner
  }
];

const fetchBestSellers = async () => {
  try {
    loading.value = true;
    const response = await productsService.getBestSellers();
    
    if (response.productos) {
      bestSellers.value = response.productos.map((product: any) => ({
        id: product.id,
        name: product.nombre,
        price: product.precio,
        image: product.imagen || '',
        store: product.tienda || 'Store'
      }));
    }
  } catch (error) {
    console.error('Error fetching best sellers:', error);
  } finally {
    loading.value = false;
  }
};

const fetchRecommendations = async () => {
  try {
    const response = await productsService.getAll({ limit: 3 });
    
    if (response.productos) {
      recommendations.value = response.productos.map((product: any) => ({
        id: product.id,
        name: product.nombre,
        price: product.precio,
        image: product.imagen || '',
        store: product.tienda || 'Store'
      }));
    }
  } catch (error) {
    console.error('Error fetching recommendations:', error);
  }
};

const goToProductDetail = async (productId: string) => {
  console.log('goToProductDetail called with productId:', productId);
  
  try {
    console.log('About to track click interaction...');
    // Track click interaction
    await interactionsService.addInteraction({
      productId: productId,
      tipo: 'click'
    });
    console.log('Click interaction tracked successfully');
    
    console.log('About to navigate to product detail...');
    router.push(`/product/${productId}`);
    console.log('Navigation completed');
  } catch (error) {
    console.error('Error in goToProductDetail:', error);
    console.log('Still navigating despite error...');
    // Still navigate even if tracking fails
    router.push(`/product/${productId}`);
  }
};

const addToCart = async (productId: string) => {
  console.log('addToCart called with productId:', productId);
  
  try {
    console.log('About to track carrito interaction...');
    // Track carrito interaction
    await interactionsService.addInteraction({
      productId: productId,
      tipo: 'carrito'
    });
    console.log('Carrito interaction tracked successfully');
    
    console.log('About to increment cart...');
    // Also increment cart count
    await interactionsService.incrementCart(productId);
    console.log('Product added to cart successfully');
  } catch (error) {
    console.error('Error in addToCart:', error);
  }
};

const handleSearch = (query: string | number | null) => {
  searchQuery.value = query as string;
  // Implement search functionality
  console.log('Searching for:', query);
};

const filterByCategory = (category: string) => {
  console.log('Filtering by category:', category);
  // Implement category filtering
};

const goToCart = () => {
  console.log('Navigate to cart');
  // Implement cart navigation
};

onMounted(() => {
  fetchBestSellers();
  fetchRecommendations();
});
</script>

<style scoped lang="scss">
.home-container {
    max-width: 480px;
    margin: 0 auto;
    padding: 0 1.6rem 7rem 1.6rem;
}

.loading-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 20vh;
    gap: 1rem;
    
    p {
        font-size: 1.6rem;
        color: #666;
    }
}

.home-header {
    margin-top: 2.4rem;
    margin-bottom: 1.2rem;
    .address-title {
        font-size: 2rem;
        font-weight: 700;
        display: flex;
        align-items: center;
    }
    .address-sub {
        font-size: 1.4rem;
        color: #888;
    }
}

.search-row {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1.6rem;
    .search-input { 
        flex: 1; 
        border: 1.5px solid #17003314;
        border-color: #17003314;
        border-radius: 58px;
        padding: 0rem 1.5rem;
        background-color: #FFFFFF;
        box-shadow: 3px 4px 7.2px 0px #1700330F;
    }
    
}

::v-deep(.q-field--standard .q-field__control:before) {
    border-bottom: none!important;
}

.search-btn {
    height: 5.6rem;
    width: 5.6rem;
    border-radius: 50%;
    background-color: #FFFFFF;
    box-shadow: 3px 4px 7.2px 0px #1700330F;
}

.promo-slider {
    margin-bottom: 2rem;
    .promo-slide {
        border-radius: 1.2rem;
        overflow: hidden;
        display: flex;
        &-info {
            width: 50%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            padding: 2rem 1.2rem;
            border-radius: 1.2rem 0 0 1.2rem;
        }

        &-title {
            font-size: 3.2rem;
            font-weight: 700;
            margin-bottom: 0.5rem;
        }

        &-description {
            font-size: 1.9rem;
            font-weight: 400;
        }

        &-img {
            width: 50%;
            img {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }
        }
    }
}

.categories-row {
    display: flex;
    gap: 1.2rem;
    margin-bottom: 2rem;
    .category-card {
        display: flex;
        align-items: center;
        gap: 2rem;
        border-radius: 1.2rem;
        padding: .8rem .9rem;
        flex: 1;
        cursor: pointer;
        transition: transform 0.2s;
        
        &:hover {
            transform: scale(1.02);
        }
        
        &.retail { background: linear-gradient(90deg, #C8C1FB 0%, #BDD2FA 100%); }
        &.market { background: linear-gradient(90deg, #B4DFFA 0%, #B9D9FA 100%); }
    }
}

.section-title {
    margin: 2rem 0 1rem 0;
}

.product-card {
    border-radius: 1.2rem;
    position: relative;
    cursor: pointer;
    transition: transform 0.2s;
    
    &:hover {
        transform: scale(1.02);
    }
    
    .product-img {
        width: 136px;
        height: 133px;
        background: #F7F8FA;
        border-radius: 1.2rem;
        display: flex;
        align-items: center;
        justify-content: center;
        
        img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            border-radius: 1.2rem;
        }
        
        .product-placeholder {
            display: flex;
            align-items: center;
            justify-content: center;
            color: #999;
        }
    }

    .add-button {
        position: absolute;
        right: 2rem;
        top: 1.2rem;
        background-color: $primary;
        width: 3.2rem;
        height: 3.2rem;
    }
}

.products-list {
    display: flex;
    flex-direction: column;
    gap: 1.2rem;
    margin-bottom: 7rem;
    .product-list-item {
        display: flex;
        align-items: center;
        border-radius: 1.2rem;
        padding: 1rem;
        cursor: pointer;
        transition: transform 0.2s;
        
        &:hover {
            transform: scale(1.01);
        }
        
        .product-list-img {
            width: 136px;
            height: 136px;
            background: #F7F8FA;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 1.2rem;
            margin-right: 1rem;
            
            img {
                width: 100%;
                height: 100%;
                object-fit: cover;
                border-radius: 1.2rem;
            }
            
            .product-placeholder {
                display: flex;
                align-items: center;
                justify-content: center;
                color: #999;
            }
        }
        .product-list-info {
            font-size: 1.2rem;
            .product-list-name { font-weight: 700; }
        }
    }
}

.bottom-nav {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    background: #fff;
    display: flex;
    justify-content: space-around;
    align-items: center;
    height: 64px;
    box-shadow: 0 -2px 8px #0001;
    z-index: 100;
}
</style>