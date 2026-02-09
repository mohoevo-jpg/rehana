<template>
  <div class="pb-24 space-y-6 animate-fade-in">
    <!-- Header -->
    <div class="px-4 pt-4 flex items-center justify-between">
      <!-- Logo/Brand -->
      <div class="flex items-center gap-2">
        <img src="/logo.png" class="w-16 h-16 object-contain drop-shadow-sm" />
        <div class="flex flex-col">
          <h1 class="text-2xl font-black text-gray-900 dark:text-white tracking-tight">ريحانة</h1>
          <!-- Updated Tagline -->
          <p class="text-xs font-bold text-primary-600 bg-primary-50 px-2 py-0.5 rounded-md self-start">عالم الورود الطبيعية و الصناعية</p>
        </div>
      </div>

      <!-- Location Button -->
      <div class="relative">
        <button @click="showLocationDropdown = !showLocationDropdown" class="flex items-center gap-2 bg-white border border-gray-100 pl-2 pr-3 py-1.5 rounded-full shadow-sm text-sm font-bold text-gray-700 active:scale-95 transition-transform">
          <div class="w-6 h-6 bg-primary-50 rounded-full flex items-center justify-center">
            <MapPin class="w-3.5 h-3.5 text-primary-600" />
          </div>
          <span class="max-w-[100px] truncate">{{ currentAddressName }}</span>
          <ChevronDown class="w-3 h-3 text-gray-400" />
        </button>

        <!-- Location Dropdown -->
        <div v-if="showLocationDropdown" class="absolute top-full left-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 p-2 z-30 animate-scale-in origin-top-left">
           <div class="px-3 py-2 text-xs font-bold text-gray-400">اختر موقع التوصيل</div>
           
           <div v-if="authStore.user?.addresses?.length > 0">
              <button v-for="addr in authStore.user.addresses" :key="addr.id" @click="selectAddress(addr)" class="w-full text-right px-3 py-2.5 rounded-xl text-sm flex items-center gap-2 transition-colors" :class="currentAddressId === addr.id ? 'bg-primary-50 text-primary-700 font-bold' : 'hover:bg-gray-50 text-gray-700'">
                 <MapPin class="w-4 h-4" :class="currentAddressId === addr.id ? 'text-primary-600' : 'text-gray-400'" />
                 <span class="flex-1 truncate">{{ addr.name }}</span>
                 <Check v-if="currentAddressId === addr.id" class="w-3 h-3 text-primary-600" />
              </button>
           </div>
           
           <div v-else class="text-center py-6 flex flex-col items-center">
              <div class="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 mb-2">
                <MapPin class="w-5 h-5" />
              </div>
              <p class="text-xs text-gray-500 mb-3">لا توجد عناوين محفوظة</p>
              <router-link to="/addresses" class="px-4 py-1.5 bg-primary-50 text-primary-600 rounded-lg text-xs font-bold hover:bg-primary-100 transition-colors">
                إضافة عنوان جديد
              </router-link>
           </div>
        </div>
        
        <div v-if="showLocationDropdown" @click="showLocationDropdown = false" class="fixed inset-0 z-20 cursor-default"></div>
      </div>
    </div>

    <!-- Search Bar -->
    <div class="px-4">
      <div class="relative">
        <Search class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input type="text" v-model="searchQuery" placeholder="ابحث عن منتج..." class="w-full bg-white pl-4 pr-12 py-3.5 rounded-2xl shadow-sm border border-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all text-sm font-medium placeholder:text-gray-400">
        <div class="absolute left-2 top-1/2 -translate-y-1/2 z-20">
            <button @click="showSortMenu = !showSortMenu" class="p-2 bg-gray-50 rounded-xl text-gray-500 hover:text-primary-600 transition-colors" :class="{'bg-primary-50 text-primary-600': showSortMenu}">
              <SlidersHorizontal class="w-4 h-4" />
            </button>
            
            <div v-if="showSortMenu" class="absolute top-full left-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 p-2 animate-scale-in origin-top-left overflow-hidden z-30">
                <div class="px-3 py-2 text-xs font-bold text-gray-400">ترتيب حسب</div>
                
                <button @click="sortOption = 'popularity'; showSortMenu = false" class="w-full text-right px-3 py-2.5 rounded-xl text-sm flex items-center gap-2 transition-colors" :class="sortOption === 'popularity' ? 'bg-primary-50 text-primary-700 font-bold' : 'hover:bg-gray-50 text-gray-700'">
                    <Flame class="w-4 h-4" />
                    <span>الأكثر طلباً</span>
                    <Check v-if="sortOption === 'popularity'" class="w-3 h-3 mr-auto text-primary-600" />
                </button>

                <button @click="sortOption = 'price-asc'; showSortMenu = false" class="w-full text-right px-3 py-2.5 rounded-xl text-sm flex items-center gap-2 transition-colors" :class="sortOption === 'price-asc' ? 'bg-primary-50 text-primary-700 font-bold' : 'hover:bg-gray-50 text-gray-700'">
                    <ArrowDownUp class="w-4 h-4" />
                    <span>السعر: الأقل إلى الأعلى</span>
                    <Check v-if="sortOption === 'price-asc'" class="w-3 h-3 mr-auto text-primary-600" />
                </button>

                <button @click="sortOption = 'price-desc'; showSortMenu = false" class="w-full text-right px-3 py-2.5 rounded-xl text-sm flex items-center gap-2 transition-colors" :class="sortOption === 'price-desc' ? 'bg-primary-50 text-primary-700 font-bold' : 'hover:bg-gray-50 text-gray-700'">
                    <ArrowUpDown class="w-4 h-4" />
                    <span>السعر: الأعلى إلى الأقل</span>
                    <Check v-if="sortOption === 'price-desc'" class="w-3 h-3 mr-auto text-primary-600" />
                </button>

                 <button @click="sortOption = 'name-asc'; showSortMenu = false" class="w-full text-right px-3 py-2.5 rounded-xl text-sm flex items-center gap-2 transition-colors" :class="sortOption === 'name-asc' ? 'bg-primary-50 text-primary-700 font-bold' : 'hover:bg-gray-50 text-gray-700'">
                    <ArrowUpAZ class="w-4 h-4" />
                    <span>الاسم: أ - ي</span>
                    <Check v-if="sortOption === 'name-asc'" class="w-3 h-3 mr-auto text-primary-600" />
                </button>

                 <button @click="sortOption = 'name-desc'; showSortMenu = false" class="w-full text-right px-3 py-2.5 rounded-xl text-sm flex items-center gap-2 transition-colors" :class="sortOption === 'name-desc' ? 'bg-primary-50 text-primary-700 font-bold' : 'hover:bg-gray-50 text-gray-700'">
                    <ArrowDownZA class="w-4 h-4" />
                    <span>الاسم: ي - أ</span>
                    <Check v-if="sortOption === 'name-desc'" class="w-3 h-3 mr-auto text-primary-600" />
                </button>
            </div>
            
            <div v-if="showSortMenu" @click="showSortMenu = false" class="fixed inset-0 z-10 cursor-default"></div>
        </div>
      </div>
    </div>

    <!-- Hero / Banners Section -->
    <div class="relative">
      <div v-if="appStore.banners.length === 0" class="flex gap-4 px-4 overflow-x-auto pb-4">
         <div class="shrink-0 w-[90%] sm:w-[80%] h-48 bg-gray-100 rounded-3xl animate-pulse"></div>
      </div>
      <div v-else class="flex overflow-x-auto snap-x snap-mandatory gap-4 px-4 pb-4 hide-scrollbar">
        <div v-for="banner in appStore.banners" :key="banner.id" class="snap-center shrink-0 w-[90%] sm:w-[80%] h-48 rounded-3xl overflow-hidden relative shadow-lg shadow-primary-900/10 group">
          <!-- Dynamic Background Color/Gradient -->
          <div :style="{ background: `linear-gradient(to right, ${banner.colorFrom || '#4f46e5'}, ${banner.colorTo || '#9333ea'})` }" class="absolute inset-0"></div>
          
          <div class="absolute inset-0 flex items-center p-6">
            <div class="w-2/3 text-white z-10">
              <span class="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-bold mb-3 border border-white/10">{{ banner.subtitle }}</span>
              <h2 class="text-2xl font-black mb-2 leading-tight drop-shadow-sm">{{ banner.title }}</h2>
              <button @click="handleBannerClick(banner)" class="px-5 py-2 bg-white text-primary-700 rounded-xl text-sm font-bold shadow-sm active:scale-95 transition-transform hover:bg-gray-50">تسوق الآن</button>
            </div>
            <!-- Decorative Circles -->
            <div class="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
            <div class="absolute right-10 top-10 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Categories Section -->
    <div>
      <div class="flex justify-between items-center px-4 mb-4">
        <h3 class="font-bold text-gray-900 text-lg">التصنيفات</h3>
        <button @click="scrollToProducts" class="text-primary-600 text-sm font-medium hover:underline">عرض الكل</button>
      </div>
      
      <div v-if="appStore.categories.length === 0" class="flex gap-4 px-4 overflow-x-auto pb-4">
         <div v-for="n in 5" :key="n" class="flex flex-col items-center gap-2 min-w-[4.5rem]">
            <div class="w-16 h-16 rounded-full bg-gray-100 animate-pulse"></div>
            <div class="w-12 h-3 bg-gray-100 rounded animate-pulse"></div>
         </div>
      </div>

      <div v-else class="flex overflow-x-auto gap-4 px-4 pb-4 hide-scrollbar">
        <div 
          v-for="cat in appStore.categories" 
          :key="cat.id" 
          @click="selectCategory(cat.id)"
          class="flex flex-col items-center gap-2 min-w-[4.5rem] cursor-pointer group"
        >
          <div 
            class="p-[2px] rounded-full transition-all duration-300"
            :class="[selectedCategory === cat.id ? 'bg-gradient-to-tr from-primary-600 to-secondary-600 scale-110 shadow-md' : 'bg-gradient-to-tr from-primary-500 to-secondary-500 group-hover:from-primary-600 group-hover:to-secondary-600']"
          >
             <div class="w-16 h-16 rounded-full bg-white border-2 border-transparent flex items-center justify-center text-2xl shadow-sm group-active:scale-95 transition-transform overflow-hidden relative">
               <img v-if="cat.image" :src="cat.image" class="w-full h-full object-cover">
               <span v-else>{{ cat.icon || '📦' }}</span>
             </div>
          </div>
          <span 
            class="text-xs font-bold transition-colors"
            :class="[selectedCategory === cat.id ? 'text-primary-700' : 'text-gray-700 group-hover:text-primary-700']"
          >{{ cat.name }}</span>
        </div>
      </div>
    </div>

    <!-- Featured Products (Horizontal Scroll) -->
    <div>
      <div class="flex justify-between items-center px-4 mb-4">
        <h3 class="font-bold text-gray-900 text-lg flex items-center gap-2">
          الأكثر مبيعاً
          <span class="flex h-2 w-2 relative">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span class="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
          </span>
        </h3>
        <button @click="scrollToProducts" class="text-primary-600 text-sm font-medium hover:underline">عرض الكل</button>
      </div>
      
      <div v-if="appStore.products.length === 0" class="flex gap-4 px-4 overflow-x-auto pb-4">
        <div v-for="n in 3" :key="n" class="min-w-[160px] h-64 bg-gray-100 rounded-2xl animate-pulse"></div>
      </div>

      <div v-else class="flex overflow-x-auto gap-4 px-4 pb-6 hide-scrollbar snap-x">
        <div v-for="product in appStore.products.slice(0, 5)" :key="product.id" @click="openProductModal(product)" class="snap-start shrink-0 w-44 bg-white rounded-2xl p-3 shadow-sm border border-gray-100 flex flex-col relative group hover:shadow-lg transition-all duration-300 cursor-pointer active:scale-95">
           <!-- Discount Badge (Mock) -->
           <div v-if="product.isAvailable !== false" class="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full z-10 shadow-sm">
             جديد
           </div>
           
           <!-- Out of Stock Badge -->
           <div v-if="product.isAvailable === false" class="absolute top-3 left-3 bg-gray-900/80 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded-full z-10 shadow-sm">
             نفذت الكمية
           </div>

           <div class="aspect-square bg-gray-50 rounded-xl mb-3 flex items-center justify-center relative overflow-hidden">
            <img 
              v-if="product.images && product.images.length > 0" 
              :src="product.images[0]" 
              class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              :class="{'opacity-50': product.isAvailable === false}"
              crossorigin="anonymous"
              referrerpolicy="no-referrer"
            />
            <Package 
              v-else
              class="w-10 h-10 text-gray-300 group-hover:scale-110 transition-transform duration-500" 
              :class="{'opacity-50': product.isAvailable === false}" 
            />
            
            <!-- Favorite Button -->
            <button @click.stop="toggleFavorite(product)" class="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow-sm text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors z-20">
                <Heart class="w-4 h-4" :class="{'fill-red-500 text-red-500': isFavorite(product.id)}" />
             </button>

           </div>
           
           <h3 class="font-bold text-gray-900 text-sm mb-1 line-clamp-2" :class="{'text-gray-400': product.isAvailable === false}">{{ product.name }}</h3>
           
           <!-- Previous Orders Badge -->
           <div v-if="getOrderCount(product.id) > 0" class="mb-2 flex items-center gap-1">
              <span class="px-1.5 py-0.5 bg-blue-50 text-blue-600 rounded text-[10px] font-bold flex items-center gap-1">
                 <ShoppingBag class="w-3 h-3" />
                 طلبته {{ getOrderCount(product.id) }} مرة
              </span>
           </div>

           <div class="mt-auto flex items-center justify-between">
             <div class="flex flex-col">
               <span class="text-xs text-gray-400 line-through" v-if="product.discountPrice && product.isAvailable !== false">{{ product.price }}</span>
               <span class="text-primary-700 font-black" :class="{'text-gray-400': product.isAvailable === false}">{{ product.discountPrice || product.price }} <span class="text-[10px] font-normal">د.ع</span></span>
             </div>
             <button @click.stop="addToCart(product)" :disabled="product.isAvailable === false" :class="[product.isAvailable === false ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-primary-50 text-primary-600 hover:bg-primary-600 hover:text-white']" class="w-8 h-8 rounded-lg flex items-center justify-center transition-colors">
               <Plus class="w-5 h-5" />
             </button>
           </div>
        </div>
      </div>
    </div>

    <!-- All Products (Grid) -->
    <div class="px-4" id="all-products">
      <h3 class="font-bold text-gray-900 text-lg mb-4">جميع المنتجات</h3>
      
      <div v-if="filteredProducts.length === 0" class="text-center py-10">
        <p class="text-gray-500">لا توجد منتجات</p>
      </div>

      <div v-else class="grid grid-cols-2 gap-4">
        <div v-for="product in filteredProducts" :key="product.id" @click="openProductModal(product)" class="bg-white rounded-2xl p-3 shadow-sm border border-gray-100 flex flex-col group relative overflow-hidden transition-all hover:shadow-md cursor-pointer">
          <!-- Out of Stock Overlay -->
          <div v-if="product.isAvailable === false" class="absolute inset-0 bg-white/40 z-10 pointer-events-none"></div>

          <div class="aspect-square bg-gray-50 rounded-xl mb-3 flex items-center justify-center relative overflow-hidden">
             <img 
               v-if="product.images && product.images.length > 0" 
               :src="product.images[0]" 
               class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
               :class="{'opacity-50': product.isAvailable === false}"
               crossorigin="anonymous"
               referrerpolicy="no-referrer"
             />
             <Package 
               v-else
               class="w-10 h-10 text-gray-300 group-hover:scale-110 transition-transform duration-300" 
               :class="{'opacity-50': product.isAvailable === false}" 
             />
             
             <!-- Favorite Button -->
             <button @click.stop="toggleFavorite(product)" class="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow-sm text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors z-20">
                <Heart class="w-4 h-4" :class="{'fill-red-500 text-red-500': isFavorite(product.id)}" />
             </button>

             <div v-if="product.isAvailable === false" class="absolute inset-0 flex items-center justify-center bg-gray-100/50 backdrop-blur-[1px]">
                <span class="text-xs font-bold text-gray-500 bg-white px-2 py-1 rounded-lg shadow-sm">غير متوفر</span>
             </div>
          </div>

          <h3 class="font-bold text-gray-900 text-sm mb-1 line-clamp-2 min-h-[2.5rem]" :class="{'text-gray-400': product.isAvailable === false}">{{ product.name }}</h3>
          
          <!-- Previous Orders Badge -->
          <div v-if="getOrderCount(product.id) > 0" class="mb-2 flex items-center gap-1">
             <span class="px-1.5 py-0.5 bg-blue-50 text-blue-600 rounded text-[10px] font-bold flex items-center gap-1">
                <ShoppingBag class="w-3 h-3" />
                طلبته {{ getOrderCount(product.id) }} مرة
             </span>
          </div>

          <div class="mt-auto pt-2 flex items-center justify-between relative z-20">
            <p class="text-gray-900 font-black" :class="{'text-gray-400': product.isAvailable === false}">{{ product.price }} <span class="text-[10px] font-normal text-gray-500">د.ع</span></p>
            <button 
              @click.stop="addToCart(product)"
              :disabled="product.isAvailable === false"
              :class="[product.isAvailable === false ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-primary-600 text-white shadow-lg shadow-primary-600/20 hover:bg-primary-700 active:scale-90']"
              class="w-9 h-9 rounded-xl flex items-center justify-center transition-all"
            >
              <Plus class="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Product Details Modal -->
    <div v-if="selectedProduct" class="fixed inset-0 z-50 flex items-end sm:items-center justify-center pointer-events-none p-0 sm:p-4">
      <!-- Backdrop -->
      <div class="absolute inset-0 bg-black/60 backdrop-blur-sm pointer-events-auto transition-opacity duration-300" @click="selectedProduct = null"></div>
      
      <!-- Modal Content -->
      <div class="bg-white w-full sm:w-[450px] max-h-[90vh] flex flex-col rounded-t-[2.5rem] sm:rounded-[2.5rem] pointer-events-auto transform transition-transform duration-300 ease-out shadow-2xl relative animate-slide-up overflow-hidden">
        
        <!-- Header Image Section -->
        <div class="relative h-72 bg-gray-50 w-full shrink-0">
          <img 
            v-if="selectedProduct.images && selectedProduct.images.length > 0" 
            :src="selectedProduct.images[0]" 
            class="w-full h-full object-contain p-8 mix-blend-multiply"
          >
          <div v-else class="w-full h-full flex items-center justify-center text-gray-300">
            <Package class="w-20 h-20" />
          </div>

          <!-- Close Button -->
          <button @click="selectedProduct = null" class="absolute top-5 right-5 w-10 h-10 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center text-gray-500 hover:text-gray-900 shadow-sm transition-all active:scale-90 z-10">
            <X class="w-5 h-5" />
          </button>

          <!-- Favorite Button -->
          <button @click="toggleFavorite(selectedProduct)" class="absolute top-5 left-5 w-10 h-10 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center shadow-sm transition-all active:scale-90 z-10" :class="isFavorite(selectedProduct.id) ? 'text-red-500' : 'text-gray-400 hover:text-red-500'">
            <Heart class="w-5 h-5" :class="{'fill-current': isFavorite(selectedProduct.id)}" />
          </button>
        </div>

        <!-- Content Section -->
        <div class="flex-1 overflow-y-auto p-6 sm:p-8">
          <div class="flex justify-between items-start gap-4 mb-2">
            <div>
              <h3 class="text-2xl font-black text-gray-900 leading-tight mb-2">{{ selectedProduct.name }}</h3>
              <div class="flex items-center gap-2">
                <div class="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg border border-yellow-100">
                  <Star class="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                  <span class="text-xs font-bold text-gray-700 pt-0.5">4.8</span>
                </div>
                <span class="text-xs text-gray-400">(120 تقييم)</span>
              </div>
            </div>
            <div class="text-left shrink-0">
               <div class="text-2xl font-black text-primary-600">{{ selectedProduct.discountPrice || selectedProduct.price }} <span class="text-sm font-bold text-gray-500">د.ع</span></div>
               <div v-if="selectedProduct.discountPrice" class="text-sm text-gray-400 line-through decoration-red-400 decoration-2">{{ selectedProduct.price }}</div>
            </div>
          </div>

          <div v-if="selectedProduct.isAvailable === false" class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-600 text-xs font-bold rounded-xl mb-6">
             <AlertTriangle class="w-3.5 h-3.5" />
             هذا المنتج غير متوفر حالياً
          </div>

          <div class="space-y-3 mb-8">
            <h4 class="font-bold text-gray-900">الوصف</h4>
            <p class="text-gray-500 text-sm leading-relaxed">
              {{ selectedProduct.description || 'هذا المنتج مميز وعالي الجودة، مصنوع بعناية فائقة ليلبي احتياجاتك. يتميز بتصميم عصري وأداء ممتاز.' }}
            </p>
          </div>
        </div>

        <!-- Bottom Action Bar -->
        <div class="p-6 sm:p-8 pt-2 border-t border-gray-100 bg-white">
          <div class="flex gap-4">
             <!-- Quantity -->
             <div class="flex items-center bg-gray-50 rounded-2xl px-2 border border-gray-100 h-14" :class="{'opacity-50 pointer-events-none': selectedProduct.isAvailable === false}">
               <button @click="modalQuantity > 1 ? modalQuantity-- : null" class="w-10 h-full flex items-center justify-center text-gray-500 hover:text-primary-600 active:scale-90 transition-transform">
                 <Minus class="w-5 h-5" />
               </button>
               <span class="w-8 text-center font-bold text-lg text-gray-900">{{ modalQuantity }}</span>
               <button @click="modalQuantity++" class="w-10 h-full flex items-center justify-center text-gray-500 hover:text-primary-600 active:scale-90 transition-transform">
                 <Plus class="w-5 h-5" />
               </button>
             </div>

             <!-- Add Button -->
             <button 
               @click="addToCartFromModal" 
               :disabled="selectedProduct.isAvailable === false"
               :class="[selectedProduct.isAvailable === false ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-primary-600 text-white shadow-xl shadow-primary-600/30 hover:bg-primary-700 active:scale-95']"
               class="flex-1 h-14 rounded-2xl font-bold transition-all flex items-center justify-center gap-3 text-lg"
             >
               <ShoppingCart class="w-6 h-6" />
               {{ selectedProduct.isAvailable === false ? 'نفذت الكمية' : 'إضافة للسلة' }}
             </button>
          </div>
        </div>
      </div>
    </div>

    <!-- About Us Modal -->
    <Teleport to="body">
      <div v-if="showAboutModal" class="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6" dir="rtl">
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" @click="showAboutModal = false"></div>
        
        <div class="bg-white rounded-3xl w-full max-w-lg p-6 relative z-10 animate-scale-in shadow-2xl flex flex-col max-h-[90vh]">
          <!-- Header -->
          <div class="flex justify-between items-center mb-4 shrink-0 border-b border-gray-100 pb-4">
            <h3 class="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Info class="w-6 h-6 text-primary-600" />
              من نحن
            </h3>
            <button @click="showAboutModal = false" class="p-2 bg-gray-50 rounded-full hover:bg-gray-100 transition-colors">
              <X class="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <!-- Content -->
          <div class="overflow-y-auto flex-1 space-y-6">
            <!-- About Text -->
            <div class="bg-primary-50/50 rounded-2xl p-5 border border-primary-100">
              <p class="text-gray-700 leading-relaxed whitespace-pre-line font-medium text-justify">
                {{ appStore.settings?.aboutUsText || 'نحن متجر ريحانة...' }}
              </p>
            </div>

            <!-- Social Links -->
            <div class="space-y-3">
              <h4 class="font-bold text-gray-900 text-sm mb-3">تابعنا على مواقع التواصل</h4>
              
              <a v-if="appStore.settings?.facebookUrl" :href="appStore.settings.facebookUrl" target="_blank" class="flex items-center gap-3 p-3 bg-[#1877F2]/10 hover:bg-[#1877F2]/20 rounded-xl transition-colors group">
                <div class="w-10 h-10 bg-[#1877F2] rounded-full flex items-center justify-center text-white shadow-lg shadow-[#1877F2]/30">
                  <Facebook class="w-5 h-5" />
                </div>
                <span class="font-bold text-[#1877F2]">Facebook</span>
                <ArrowUpLeft class="w-4 h-4 text-[#1877F2] mr-auto opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>

              <a v-if="appStore.settings?.instagramUrl" :href="appStore.settings.instagramUrl" target="_blank" class="flex items-center gap-3 p-3 bg-[#E4405F]/10 hover:bg-[#E4405F]/20 rounded-xl transition-colors group">
                <div class="w-10 h-10 bg-gradient-to-tr from-[#FFDC80] via-[#E4405F] to-[#C13584] rounded-full flex items-center justify-center text-white shadow-lg shadow-[#E4405F]/30">
                  <Instagram class="w-5 h-5" />
                </div>
                <span class="font-bold text-[#E4405F]">Instagram</span>
                <ArrowUpLeft class="w-4 h-4 text-[#E4405F] mr-auto opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>

              <a v-if="appStore.settings?.tiktokUrl" :href="appStore.settings.tiktokUrl" target="_blank" class="flex items-center gap-3 p-3 bg-black/5 hover:bg-black/10 rounded-xl transition-colors group">
                <div class="w-10 h-10 bg-black rounded-full flex items-center justify-center text-white shadow-lg shadow-black/30">
                  <Music class="w-5 h-5" />
                </div>
                <span class="font-bold text-gray-900">TikTok</span>
                <ArrowUpLeft class="w-4 h-4 text-gray-900 mr-auto opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
              
               <a v-if="appStore.settings?.email" :href="`mailto:${appStore.settings.email}`" class="flex items-center gap-3 p-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors group">
                <div class="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center text-white shadow-lg shadow-gray-700/30">
                  <Mail class="w-5 h-5" />
                </div>
                <span class="font-bold text-gray-700">Email</span>
                <ArrowUpLeft class="w-4 h-4 text-gray-700 mr-auto opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
            </div>
          </div>
          
          <!-- Footer -->
          <div class="mt-6 pt-4 border-t border-gray-100 text-center">
            <p class="text-xs text-gray-400 font-medium">ريحانة - عالم الورود الطبيعية والصناعية</p>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import logo from '@/assets/logo.png'
// ... existing imports
import { ref, computed } from 'vue'
import { Search, Package, Plus, SlidersHorizontal, X, Star, Minus, ShoppingCart, Heart, ShoppingBag, AlertTriangle, ArrowUpDown, ArrowDownUp, ArrowUpAZ, ArrowDownZA, Flame } from 'lucide-vue-next'
import { useAppStore } from '../store/app'
import { useAuthStore } from '../store/auth'

const appStore = useAppStore()
const authStore = useAuthStore()
const searchQuery = ref('')
const selectedProduct = ref(null)
const selectedCategory = ref(null)
const modalQuantity = ref(1)

// Location Logic
import { MapPin, ChevronDown, Check, Info, Facebook, Instagram, Music, Mail, ArrowUpLeft } from 'lucide-vue-next'
const showAboutModal = ref(false)
const showLocationDropdown = ref(false)
const currentAddressId = ref(null)

const currentAddressName = computed(() => {
  if (currentAddressId.value) {
    const addr = authStore.user?.addresses?.find(a => a.id === currentAddressId.value)
    if (addr) return addr.name
  }
  // Default or fallback
  if (authStore.user?.addresses?.length > 0) {
    return authStore.user.addresses[0].name
  }
  return 'اختر موقع'
})

const selectAddress = (addr) => {
  currentAddressId.value = addr.id
  showLocationDropdown.value = false
}

const toggleFavorite = (product) => {
  authStore.toggleFavorite(product.id)
}

const isFavorite = (productId) => {
  return authStore.user?.favorites?.includes(productId)
}

const getOrderCount = (productId) => {
  return appStore.getProductOrderCount(productId)
}

const showSortMenu = ref(false)
const sortOption = ref('popularity')

const filteredProducts = computed(() => {
  let products = [...(appStore.products || [])]
  
  // Filter by Category
  if (selectedCategory.value) {
    products = products.filter(p => p.categoryId === selectedCategory.value || p.category?.id === selectedCategory.value)
  }

  // Filter by Search
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    products = products.filter(p => 
      p.name.toLowerCase().includes(query)
    )
  }
  
  // Sort
  switch (sortOption.value) {
    case 'price-asc':
      products.sort((a, b) => {
        const pA = a.discountPrice || a.price
        const pB = b.discountPrice || b.price
        return pA - pB
      })
      break
    case 'price-desc':
      products.sort((a, b) => {
        const pA = a.discountPrice || a.price
        const pB = b.discountPrice || b.price
        return pB - pA
      })
      break
    case 'name-asc':
      products.sort((a, b) => a.name.localeCompare(b.name))
      break
    case 'name-desc':
      products.sort((a, b) => b.name.localeCompare(a.name))
      break
    case 'popularity':
    default:
       products.sort((a, b) => getOrderCount(b.id) - getOrderCount(a.id))
       break
  }
  
  return products
})

const selectCategory = (id) => {
  if (selectedCategory.value === id) {
    selectedCategory.value = null
  } else {
    selectedCategory.value = id
  }
  scrollToProducts()
}

const scrollToProducts = () => {
  const el = document.getElementById('all-products')
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' })
  }
}

const handleBannerClick = (banner) => {
  if (banner.categoryId) {
    selectCategory(banner.categoryId)
  } else if (banner.productId) {
    const product = appStore.products.find(p => p.id === banner.productId)
    if (product) {
      openProductModal(product)
    }
  } else {
    scrollToProducts()
  }
}

const openProductModal = (product) => {
  selectedProduct.value = product
  modalQuantity.value = 1
}

const addToCart = (product) => {
  if (product.isAvailable === false) return
  appStore.addToCart(product)
  // Show toast notification here ideally
}

const addToCartFromModal = () => {
  if (selectedProduct.value && selectedProduct.value.isAvailable !== false) {
    appStore.addToCart(selectedProduct.value, modalQuantity.value)
    selectedProduct.value = null
  }
}
</script>