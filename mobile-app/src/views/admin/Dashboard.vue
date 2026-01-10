<template>
  <div class="min-h-screen bg-gray-50/50 pb-24 font-sans relative overflow-x-hidden">
    <!-- Admin Header -->
    <header class="bg-white sticky top-0 z-30 pt-12 pb-4 px-6 shadow-sm border-b border-gray-100/50 backdrop-blur-xl bg-white/80">
      <div class="flex justify-between items-center">
        <div class="flex items-center gap-3">
          <button @click="showSidebar = true" class="p-2 -ml-2 rounded-xl hover:bg-gray-100 transition-colors text-gray-700">
            <Menu class="w-6 h-6" />
          </button>
          <div>
            <h1 class="text-xl font-bold text-gray-900 flex items-center gap-2">
              <LayoutDashboard class="w-5 h-5 text-primary-600" />
              لوحة القيادة
            </h1>
            <p class="text-xs text-gray-500 font-medium mt-0.5">أهلاً، {{ authStore.user?.name }} 👋</p>
          </div>
        </div>
        <div class="w-10 h-10 rounded-full bg-primary-50 text-primary-600 flex items-center justify-center font-bold border border-primary-100">
           {{ authStore.user?.name?.charAt(0) }}
        </div>
      </div>
    </header>

    <!-- Sidebar / Drawer -->
    <Teleport to="#app-container">
      <div v-if="showSidebar" class="absolute inset-0 z-50 flex pointer-events-none" role="dialog" aria-modal="true">
          <!-- Backdrop -->
          <div @click="showSidebar = false" class="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity animate-fade-in pointer-events-auto"></div>
          
          <!-- Sidebar Content -->
          <aside class="absolute top-0 right-0 bottom-0 bg-white w-72 h-full shadow-2xl flex flex-col animate-slide-right pointer-events-auto">
             <div class="p-6 border-b border-gray-100 flex items-center justify-between">
                <h2 class="text-xl font-bold text-gray-900">القائمة</h2>
                <button @click="showSidebar = false" class="p-2 rounded-full hover:bg-gray-50 text-gray-500 transition-colors">
                   <X class="w-5 h-5" />
                </button>
             </div>
             
             <nav class="flex-1 p-4 space-y-2 overflow-y-auto">
                <a href="#" @click.prevent="switchTab('products')" :class="activeTab === 'products' ? 'bg-primary-50 text-primary-700 font-bold' : 'text-gray-600 font-medium hover:bg-gray-50 hover:text-gray-900'" class="flex items-center gap-3 px-4 py-3 rounded-xl transition-colors">
                   <Package class="w-5 h-5" />
                   المنتجات
                </a>
                <a href="#" @click.prevent="switchTab('orders')" :class="activeTab === 'orders' ? 'bg-primary-50 text-primary-700 font-bold' : 'text-gray-600 font-medium hover:bg-gray-50 hover:text-gray-900'" class="flex items-center gap-3 px-4 py-3 rounded-xl transition-colors">
                   <ShoppingBag class="w-5 h-5" />
                   الطلبات
                </a>
                <a href="#" @click.prevent="switchTab('users')" :class="activeTab === 'users' ? 'bg-primary-50 text-primary-700 font-bold' : 'text-gray-600 font-medium hover:bg-gray-50 hover:text-gray-900'" class="flex items-center gap-3 px-4 py-3 rounded-xl transition-colors">
                   <Users class="w-5 h-5" />
                   المستخدمين
                </a>
                <a href="#" @click.prevent="switchTab('categories')" :class="activeTab === 'categories' ? 'bg-primary-50 text-primary-700 font-bold' : 'text-gray-600 font-medium hover:bg-gray-50 hover:text-gray-900'" class="flex items-center gap-3 px-4 py-3 rounded-xl transition-colors">
                   <LayoutList class="w-5 h-5" />
                   التصنيفات
                </a>
                <a href="#" @click.prevent="switchTab('banners')" :class="activeTab === 'banners' ? 'bg-primary-50 text-primary-700 font-bold' : 'text-gray-600 font-medium hover:bg-gray-50 hover:text-gray-900'" class="flex items-center gap-3 px-4 py-3 rounded-xl transition-colors">
                   <ImageIcon class="w-5 h-5" />
                   الإعلانات
                </a>
                <router-link to="/" @click="showSidebar = false" class="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 font-medium hover:bg-gray-50 hover:text-gray-900 transition-colors">
                   <Home class="w-5 h-5" />
                   الواجهة الرئيسية
                </router-link>
                <a href="#" @click.prevent="switchTab('settings')" :class="activeTab === 'settings' ? 'bg-primary-50 text-primary-700 font-bold' : 'text-gray-600 font-medium hover:bg-gray-50 hover:text-gray-900'" class="flex items-center gap-3 px-4 py-3 rounded-xl transition-colors">
                   <Settings class="w-5 h-5" />
                   الإعدادات
                </a>
             </nav>

             <div class="p-4 border-t border-gray-100">
                <button @click="handleLogout" class="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 font-medium hover:bg-red-50 transition-colors">
                   <LogOut class="w-5 h-5" />
                   تسجيل الخروج
                </button>
             </div>
          </aside>
      </div>
    </Teleport>

    <main class="p-6 space-y-8">
      <div v-if="activeTab !== 'settings'" class="space-y-8">
        <!-- Stats Row -->
        <div class="grid grid-cols-2 gap-4">
          <div class="bg-gradient-to-br from-primary-500 to-primary-700 rounded-3xl p-5 text-white shadow-lg shadow-primary-500/20 relative overflow-hidden group">
            <div class="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
            <div class="relative z-10">
              <div class="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center mb-4 backdrop-blur-sm">
                <Package class="w-5 h-5 text-white" />
              </div>
              <p class="text-primary-100 text-xs font-medium mb-1">المنتجات</p>
              <h3 class="text-3xl font-bold tracking-tight">{{ appStore.products.length }}</h3>
            </div>
          </div>

          <div class="bg-gradient-to-br from-secondary-500 to-pink-600 rounded-3xl p-5 text-white shadow-lg shadow-secondary-500/20 relative overflow-hidden group">
            <div class="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
            <div class="relative z-10">
              <div class="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center mb-4 backdrop-blur-sm">
                <ShoppingBag class="w-5 h-5 text-white" />
              </div>
              <p class="text-secondary-100 text-xs font-medium mb-1">الطلبات</p>
              <h3 class="text-3xl font-bold tracking-tight">{{ appStore.orders.length }}</h3>
            </div>
          </div>
        </div>

        <!-- Chart Section -->
        <div class="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <div class="flex items-center justify-between mb-6">
            <h3 class="font-bold text-gray-900 text-lg">تحليل المبيعات</h3>
            <div class="flex gap-2">
               <span class="w-2 h-2 rounded-full bg-primary-500"></span>
               <span class="text-xs text-gray-400">أسبوعي</span>
            </div>
          </div>
          <div class="h-48 w-full">
             <Bar :data="chartData" :options="chartOptions" />
          </div>
        </div>

        <!-- Tabs Navigation -->
        <div class="bg-white p-1.5 rounded-2xl shadow-sm border border-gray-100 flex gap-1">
          <button 
            @click="activeTab = 'products'"
            :class="['flex-1 py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2', activeTab === 'products' ? 'bg-gray-900 text-white shadow-lg' : 'text-gray-500 hover:bg-gray-50']"
          >
            <Package class="w-4 h-4" />
            المنتجات
          </button>
          <button 
            @click="activeTab = 'orders'"
            :class="['flex-1 py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2', activeTab === 'orders' ? 'bg-gray-900 text-white shadow-lg' : 'text-gray-500 hover:bg-gray-50']"
          >
            <ShoppingBag class="w-4 h-4" />
            الطلبات
          </button>
          <button 
            @click="activeTab = 'users'"
            :class="['flex-1 py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2', activeTab === 'users' ? 'bg-gray-900 text-white shadow-lg' : 'text-gray-500 hover:bg-gray-50']"
          >
            <Users class="w-4 h-4" />
            المستخدمين
          </button>
        </div>

        <!-- Content Area -->
        <div class="animate-fade-in">
          <!-- Users List -->
          <div v-if="activeTab === 'users'" class="space-y-4">
            <div class="grid grid-cols-1 gap-3">
               <div v-for="user in usersList" :key="user.id" class="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
                  <div class="flex items-center gap-3">
                     <div class="w-12 h-12 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center text-xl font-bold">
                        {{ user.name.charAt(0) }}
                     </div>
                     <div>
                        <h3 class="font-bold text-gray-900">{{ user.name }}</h3>
                        <p class="text-sm text-gray-500">{{ user.phone }}</p>
                     </div>
                  </div>
                  <div class="flex flex-col items-end gap-1">
                     <span class="font-bold text-primary-600">{{ (user.walletBalance || 0).toLocaleString() }} د.ع</span>
                     <button @click="openWalletModal(user)" class="text-xs bg-gray-900 text-white px-3 py-1.5 rounded-lg hover:bg-gray-800 transition-colors">
                       تعديل الرصيد
                     </button>
                  </div>
               </div>
            </div>
          </div>

          <!-- Products List -->
          <div v-else-if="activeTab === 'products'" class="space-y-4">
             <div class="relative group">
               <input 
                 v-model="searchQuery" 
                 type="text" 
                 placeholder="ابحث عن منتج..." 
                 class="w-full pl-4 pr-12 py-4 bg-white rounded-2xl border-none shadow-sm ring-1 ring-gray-100 focus:ring-2 focus:ring-primary-500 outline-none transition-all placeholder:text-gray-400 font-medium"
               >
               <Search class="absolute right-4 top-4 w-6 h-6 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
             </div>

             <div v-if="filteredProducts.length === 0" class="py-12 text-center">
                <div class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                   <PackageX class="w-10 h-10 text-gray-400" />
                </div>
                <p class="text-gray-500 font-medium">لا توجد منتجات مطابقة</p>
             </div>

             <div v-else class="grid grid-cols-1 gap-3">
               <div v-for="product in filteredProducts" :key="product.id" class="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-4 group hover:border-primary-200 transition-colors">
                 <div class="flex items-center justify-between">
                   <div class="flex items-center gap-4">
                     <div class="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center text-xl font-bold text-gray-400 group-hover:bg-primary-50 group-hover:text-primary-600 transition-colors relative overflow-hidden">
                       <img v-if="product.images && product.images.length > 0" :src="product.images[0]" class="w-full h-full object-cover" crossorigin="anonymous" referrerpolicy="no-referrer">
                       <span v-else>{{ product.name.charAt(0) }}</span>
                       <div v-if="!product.isAvailable" class="absolute inset-0 bg-white/60 backdrop-blur-[1px] rounded-xl flex items-center justify-center">
                          <span class="w-2 h-2 bg-red-500 rounded-full"></span>
                       </div>
                     </div>
                     <div>
                       <h4 class="font-bold text-gray-900 mb-0.5" :class="{'text-gray-400 line-through': !product.isAvailable}">{{ product.name }}</h4>
                       <p class="text-xs text-gray-400 font-mono">{{ product.barcode }}</p>
                     </div>
                   </div>
                   <div class="flex flex-col items-end gap-0.5">
                     <span class="font-bold text-gray-900" :class="{'text-gray-400': !product.isAvailable}">{{ product.discountPrice || product.price }} د.ع</span>
                     <span v-if="product.discountPrice" class="text-xs text-gray-400 line-through">{{ product.price }}</span>
                   </div>
                 </div>
                 
                 <!-- Actions Row -->
                 <div class="flex items-center justify-between pt-3 border-t border-gray-50">
                    <label class="flex items-center gap-2 cursor-pointer select-none">
                       <div class="relative">
                          <input type="checkbox" class="sr-only peer" :checked="product.isAvailable !== false" @change="toggleAvailability(product)">
                          <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-100 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                       </div>
                       <span class="text-xs font-bold" :class="product.isAvailable !== false ? 'text-primary-600' : 'text-gray-400'">
                          {{ product.isAvailable !== false ? 'متوفر' : 'غير متوفر' }}
                       </span>
                    </label>

                    <div class="flex items-center gap-2">
                       <button @click="openEditModal(product)" class="text-blue-500 hover:bg-blue-50 p-2 rounded-lg transition-colors flex items-center gap-1 text-xs font-bold">
                          <Edit class="w-4 h-4" />
                          تعديل
                       </button>
                       <button @click="deleteProduct(product.id)" class="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors flex items-center gap-1 text-xs font-bold">
                          <Trash2 class="w-4 h-4" />
                          حذف
                       </button>
                    </div>
                 </div>
               </div>
             </div>
          </div>

          <!-- Orders List -->
          <div v-else-if="activeTab === 'orders'" class="space-y-4">
            <div v-if="appStore.orders.length === 0" class="py-12 text-center bg-white rounded-3xl border border-gray-100">
              <div class="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Inbox class="w-10 h-10 text-gray-300" />
              </div>
              <p class="text-gray-500 font-medium">لا توجد طلبات حتى الآن</p>
            </div>
            <div v-else class="space-y-3">
              <div v-for="order in appStore.orders" :key="order.id" class="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <div class="flex justify-between items-start mb-4">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center text-primary-600 font-bold">
                       #
                    </div>
                    <div>
                      <h4 class="font-bold text-gray-900 text-sm">طلب #{{ order.id.slice(-4) }}</h4>
                      <p class="text-xs text-gray-500 mt-0.5">{{ new Date().toLocaleDateString('ar-IQ') }}</p>
                    </div>
                  </div>
                  <span :class="getStatusClass(order.status)" class="px-3 py-1 text-xs rounded-full font-bold">
                    {{ getStatusLabel(order.status) }}
                  </span>
                </div>
                
                <div class="flex justify-between items-center py-3 border-t border-gray-50">
                   <div class="flex -space-x-2 space-x-reverse overflow-hidden">
                      <!-- Placeholder for customer avatar or items -->
                      <div class="w-8 h-8 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-xs text-gray-500">
                         <User class="w-4 h-4" />
                      </div>
                   </div>
                   <span class="font-bold text-lg text-primary-700">{{ order.total }} د.ع</span>
                </div>

                <div class="grid grid-cols-2 gap-2 mt-2" v-if="order.status === 'pending'">
                  <button class="py-2.5 bg-primary-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-primary-600/20 hover:bg-primary-700 active:scale-95 transition-all">قبول</button>
                  <button class="py-2.5 bg-white text-red-500 border border-red-100 rounded-xl text-sm font-bold hover:bg-red-50 active:scale-95 transition-all">رفض</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Settings Tab -->
      <div v-if="activeTab === 'settings'" class="space-y-6 animate-fade-in">
        
        <!-- Inventory Status -->
        <div class="grid grid-cols-2 gap-4">
           <div class="bg-white p-5 rounded-3xl shadow-sm border border-gray-100">
              <div class="flex items-center gap-3 mb-2">
                 <div class="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center text-red-500">
                    <PackageX class="w-4 h-4" />
                 </div>
                 <h3 class="font-bold text-gray-900">المنتجات النافذة</h3>
              </div>
              <p class="text-2xl font-bold text-gray-900">{{ outOfStockProducts.length }}</p>
              <p class="text-xs text-gray-500 mt-1">منتج غير متوفر</p>
           </div>
           
           <div class="bg-white p-5 rounded-3xl shadow-sm border border-gray-100">
              <div class="flex items-center gap-3 mb-2">
                 <div class="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center text-green-500">
                    <Package class="w-4 h-4" />
                 </div>
                 <h3 class="font-bold text-gray-900">المتوفرة</h3>
              </div>
              <p class="text-2xl font-bold text-gray-900">{{ inStockProducts.length }}</p>
              <p class="text-xs text-gray-500 mt-1">منتج جاهز للبيع</p>
           </div>
        </div>

        <!-- Quick Inventory Actions -->
        <div class="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
           <h3 class="font-bold text-gray-900 text-lg mb-4">إدارة المخزون السريع</h3>
           
           <!-- Out of Stock List -->
           <div v-if="outOfStockProducts.length > 0" class="mb-6">
              <h4 class="text-sm font-bold text-red-500 mb-3 flex items-center gap-2">
                 <span class="w-2 h-2 bg-red-500 rounded-full"></span>
                 منتجات تحتاج إعادة تعبئة
              </h4>
              <div class="space-y-3">
                 <div v-for="product in outOfStockProducts" :key="product.id" class="flex items-center justify-between p-3 bg-red-50/50 rounded-xl border border-red-100">
                    <span class="font-medium text-gray-700">{{ product.name }}</span>
                    <button @click="toggleAvailability(product)" class="px-3 py-1.5 bg-white text-red-500 text-xs font-bold rounded-lg shadow-sm border border-red-100 hover:bg-red-50">
                       إعادة توفر
                    </button>
                 </div>
              </div>
           </div>
           <div v-else class="mb-6 text-center py-4 bg-green-50 rounded-xl border border-green-100">
              <p class="text-green-600 font-medium text-sm">ممتاز! جميع المنتجات متوفرة</p>
           </div>

           <!-- In Stock List (Preview) -->
           <div>
              <h4 class="text-sm font-bold text-green-500 mb-3 flex items-center gap-2">
                 <span class="w-2 h-2 bg-green-500 rounded-full"></span>
                 منتجات متوفرة حالياً
              </h4>
              <div class="space-y-3 max-h-60 overflow-y-auto pr-1">
                 <div v-for="product in inStockProducts" :key="product.id" class="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <span class="font-medium text-gray-700">{{ product.name }}</span>
                    <button @click="toggleAvailability(product)" class="px-3 py-1.5 bg-white text-gray-400 text-xs font-bold rounded-lg shadow-sm hover:text-red-500">
                       نفاذ الكمية
                    </button>
                 </div>
              </div>
           </div>
        </div>

        <!-- Categories Tab -->
        <div v-if="activeTab === 'categories'" class="space-y-6 animate-fade-in">
           <div class="flex justify-between items-center">
              <h2 class="text-2xl font-black text-gray-900">إدارة التصنيفات</h2>
              <button @click="openAddCategoryModal" class="px-4 py-2 bg-primary-600 text-white rounded-xl font-bold shadow-lg shadow-primary-600/20 hover:bg-primary-700 transition-transform active:scale-95 flex items-center gap-2">
                 <Plus class="w-5 h-5" />
                 إضافة تصنيف
              </button>
           </div>

           <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div v-for="cat in appStore.categories" :key="cat.id" class="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between group">
                 <div class="flex items-center gap-3">
                    <div class="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-2xl">
                       <!-- Simple icon mapping or emoji if icon lib not full -->
                       📦
                    </div>
                    <div>
                       <h3 class="font-bold text-gray-900">{{ cat.name }}</h3>
                       <p class="text-xs text-gray-400">{{ appStore.products.filter(p => p.categoryId === cat.id).length }} منتج</p>
                    </div>
                 </div>
                 <button @click="deleteCategory(cat.id)" class="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                    <Trash2 class="w-5 h-5" />
                 </button>
              </div>
           </div>
        </div>

        <!-- Banners Tab -->
        <div v-if="activeTab === 'banners'" class="space-y-6 animate-fade-in">
           <div class="flex justify-between items-center">
              <h2 class="text-2xl font-black text-gray-900">إدارة الإعلانات</h2>
              <button @click="openAddBannerModal" class="px-4 py-2 bg-primary-600 text-white rounded-xl font-bold shadow-lg shadow-primary-600/20 hover:bg-primary-700 transition-transform active:scale-95 flex items-center gap-2">
                 <Plus class="w-5 h-5" />
                 إضافة إعلان
              </button>
           </div>

           <div class="space-y-4">
              <div v-for="banner in appStore.banners" :key="banner.id" class="relative h-48 rounded-3xl overflow-hidden shadow-lg group">
                 <div :class="`absolute inset-0 bg-gradient-to-r from-${banner.colorFrom} to-${banner.colorTo}`"></div>
                 <!-- Fallback gradient if dynamic classes fail (Tailwind JIT limitation) -->
                 <div class="absolute inset-0 bg-gradient-to-r from-gray-600 to-gray-800" v-if="!banner.colorFrom"></div>
                 
                 <div class="absolute inset-0 flex items-center p-8">
                    <div class="w-2/3 text-white z-10">
                       <span class="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-bold mb-3 border border-white/10">{{ banner.subtitle }}</span>
                       <h2 class="text-2xl font-black mb-2 leading-tight">{{ banner.title }}</h2>
                    </div>
                 </div>
                 
                 <button @click="deleteBanner(banner.id)" class="absolute top-4 left-4 p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-red-500 transition-colors z-20">
                    <Trash2 class="w-5 h-5" />
                 </button>
              </div>
           </div>
        </div>

        <!-- App Settings -->
        <div class="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-6">
           <h3 class="font-bold text-gray-900 text-lg">إعدادات التطبيق العامة</h3>
           
           <!-- Store Status -->
           <div class="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
              <div>
                 <h4 class="font-bold text-gray-900">حالة المتجر</h4>
                 <p class="text-xs text-gray-500 mt-1">إغلاق المتجر يمنع استقبال طلبات جديدة</p>
              </div>
              <button 
                 @click="toggleStoreStatus"
                 :class="settings.isStoreOpen ? 'bg-green-500' : 'bg-gray-300'"
                 class="w-14 h-8 rounded-full p-1 transition-colors relative"
              >
                 <div 
                    :class="settings.isStoreOpen ? 'translate-x-6' : 'translate-x-0'"
                    class="w-6 h-6 bg-white rounded-full shadow-md transition-transform"
                 ></div>
              </button>
           </div>

           <!-- Delivery Fee -->
           <div>
              <label class="block text-sm font-bold text-gray-700 mb-2">سعر التوصيل الافتراضي</label>
              <div class="relative">
                 <input 
                    v-model.number="settings.deliveryFee" 
                    @change="saveSettings"
                    type="number" 
                    class="w-full px-4 py-3.5 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:ring-2 focus:ring-primary-500 transition-all outline-none font-bold"
                 >
                 <span class="absolute left-4 top-3.5 text-gray-400 text-sm font-bold">د.ع</span>
              </div>
           </div>

           <!-- Min Order -->
           <div>
              <label class="block text-sm font-bold text-gray-700 mb-2">الحد الأدنى للطلب</label>
              <div class="relative">
                 <input 
                    v-model.number="settings.minOrderAmount" 
                    @change="saveSettings"
                    type="number" 
                    class="w-full px-4 py-3.5 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:ring-2 focus:ring-primary-500 transition-all outline-none font-bold"
                 >
                 <span class="absolute left-4 top-3.5 text-gray-400 text-sm font-bold">د.ع</span>
              </div>
           </div>

           <!-- Social Media Links -->
           <div class="pt-6 border-t border-gray-100 space-y-4">
              <h4 class="font-bold text-gray-900">روابط التواصل الاجتماعي</h4>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">فيسبوك</label>
                <input v-model="settings.facebookUrl" @change="saveSettings" type="url" class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-left dir-ltr" placeholder="https://facebook.com/...">
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">انستغرام</label>
                <input v-model="settings.instagramUrl" @change="saveSettings" type="url" class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-left dir-ltr" placeholder="https://instagram.com/...">
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">تيك توك</label>
                <input v-model="settings.tiktokUrl" @change="saveSettings" type="url" class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-left dir-ltr" placeholder="https://tiktok.com/...">
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">البريد الإلكتروني للتواصل</label>
                <input v-model="settings.email" @change="saveSettings" type="email" class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-left dir-ltr" placeholder="info@example.com">
              </div>
           </div>
        </div>

      </div>
    </main>

    <!-- Floating Action Button -->
    <Teleport to="#app-container">
      <div v-if="activeTab === 'products'" class="absolute inset-0 z-40 flex justify-center pointer-events-none">
        <div class="w-full h-full relative">
          <button @click="showAddModal = true" class="absolute bottom-6 left-6 w-14 h-14 bg-gray-900 text-white rounded-full shadow-2xl shadow-gray-900/40 flex items-center justify-center hover:scale-110 active:scale-95 transition-all pointer-events-auto">
            <Plus class="w-7 h-7" />
          </button>
        </div>
      </div>
    </Teleport>

    <!-- Add Product Modal -->
    <Teleport to="body">
      <div v-if="showAddModal" class="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6" dir="rtl">
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" @click="showAddModal = false"></div>
        
        <div class="bg-white rounded-3xl w-full max-w-lg flex flex-col shadow-2xl relative z-10 max-h-[90vh] animate-slide-up">
          <!-- Header -->
          <div class="flex justify-between items-center px-6 py-4 border-b border-gray-100 shrink-0">
            <h3 class="text-xl font-bold text-gray-900">{{ newProduct.id ? 'تعديل المنتج' : 'إضافة منتج جديد' }}</h3>
            <button @click="showAddModal = false" class="p-2 bg-gray-50 rounded-full hover:bg-gray-100 transition-colors">
              <X class="w-5 h-5 text-gray-500" />
            </button>
          </div>
          
          <!-- Content -->
          <div class="overflow-y-auto p-6 space-y-5 flex-1">
            <div>
              <label class="block text-sm font-bold text-gray-700 mb-2">اسم المنتج</label>
              <input v-model="newProduct.name" class="w-full px-4 py-3 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:ring-2 focus:ring-primary-500 transition-all outline-none font-medium" placeholder="مثال: شامبو هيد أند شولدرز">
            </div>

            <div>
               <label class="block text-sm font-bold text-gray-700 mb-2">التصنيف</label>
               <select v-model="newProduct.categoryId" class="w-full px-4 py-3 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:ring-2 focus:ring-primary-500 transition-all outline-none font-medium appearance-none">
                  <option :value="null">اختر تصنيف...</option>
                  <option v-for="cat in appStore.categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
               </select>
            </div>

            <div>
              <label class="block text-sm font-bold text-gray-700 mb-2">صور المنتج</label>
              <div class="space-y-3">
                  <div class="flex gap-2 overflow-x-auto pb-2" v-if="newProduct.images && newProduct.images.length > 0">
                    <div v-for="(img, index) in newProduct.images" :key="index" class="relative w-20 h-20 shrink-0">
                        <img :src="img" class="w-full h-full object-cover rounded-xl border border-gray-200" crossorigin="anonymous" referrerpolicy="no-referrer">
                        <button @click="removeImage(index)" class="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-md border border-gray-100 hover:text-red-500">
                          <X class="w-3 h-3" />
                        </button>
                    </div>
                  </div>
                  <label class="flex items-center justify-center w-full h-28 px-4 transition bg-white border-2 border-gray-300 border-dashed rounded-xl appearance-none cursor-pointer hover:border-primary-500 focus:outline-none hover:bg-gray-50">
                    <span class="flex flex-col items-center space-y-2">
                        <Upload class="w-6 h-6 text-gray-400" />
                        <span class="font-medium text-gray-600 text-sm">اضغط لرفع صور (أو اسحبها هنا)</span>
                    </span>
                    <input type="file" multiple accept="image/*" class="hidden" @change="handleImageUpload">
                  </label>
              </div>
            </div>
            
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label class="block text-sm font-bold text-gray-700 mb-2">السعر</label>
                <div class="relative">
                  <input v-model.number="newProduct.price" type="number" class="w-full px-4 py-3 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:ring-2 focus:ring-primary-500 transition-all outline-none font-bold" placeholder="0">
                  <span class="absolute left-4 top-3 text-gray-400 text-sm font-bold">د.ع</span>
                </div>
              </div>
              <div>
                  <label class="block text-sm font-bold text-gray-700 mb-2">سعر الخصم (اختياري)</label>
                  <div class="relative">
                    <input v-model.number="newProduct.discountPrice" type="number" class="w-full px-4 py-3 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:ring-2 focus:ring-primary-500 transition-all outline-none font-bold" placeholder="0">
                    <span class="absolute left-4 top-3 text-gray-400 text-sm font-bold">د.ع</span>
                  </div>
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label class="block text-sm font-bold text-gray-700 mb-2">الكمية</label>
                  <input v-model.number="newProduct.quantity" type="number" class="w-full px-4 py-3 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:ring-2 focus:ring-primary-500 transition-all outline-none font-bold" placeholder="0">
                </div>
                <div>
                  <label class="block text-sm font-bold text-gray-700 mb-2">الباركود</label>
                  <div class="relative">
                    <input v-model="newProduct.barcode" class="w-full px-4 py-3 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:ring-2 focus:ring-primary-500 transition-all outline-none font-mono" placeholder="Scan...">
                    <ScanBarcode class="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                  </div>
                </div>
            </div>

            <div class="flex items-center gap-3 pt-2">
               <label class="relative inline-flex items-center cursor-pointer">
                 <input type="checkbox" v-model="newProduct.isAvailable" class="sr-only peer">
                 <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                 <span class="mr-3 text-sm font-bold text-gray-700">المنتج متاح للبيع</span>
               </label>
            </div>
          </div>

          <!-- Footer -->
          <div class="p-6 border-t border-gray-100 shrink-0 bg-gray-50/50 rounded-b-3xl">
             <button @click="addProduct" class="w-full py-3.5 bg-primary-600 text-white rounded-xl font-bold text-lg shadow-xl shadow-primary-600/30 hover:bg-primary-700 active:scale-95 transition-all flex items-center justify-center gap-2">
               <span v-if="!newProduct.id"><Plus class="w-6 h-6" /></span>
               <span v-else><Edit class="w-5 h-5" /></span>
               {{ newProduct.id ? 'حفظ التعديلات' : 'إضافة المنتج' }}
             </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Wallet Modal -->
    <Teleport to="#app-container">
      <div v-if="showWalletModal" class="absolute inset-0 z-[100] flex justify-center pointer-events-none">
        <div class="w-full h-full relative pointer-events-auto flex items-center justify-center p-4">
           <div class="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" @click="closeWalletModal"></div>
           <div class="bg-white w-full max-w-sm rounded-3xl p-6 relative z-10 animate-slide-up shadow-2xl">
              <div class="text-center mb-6">
                 <div class="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Wallet class="w-8 h-8 text-primary-600" />
                 </div>
                 <h3 class="text-xl font-bold text-gray-900">إدارة المحفظة</h3>
                 <p class="text-sm text-gray-500 mt-1">{{ selectedUser?.name }}</p>
              </div>
              
              <div class="space-y-4">
                 <div>
                    <label class="block text-sm font-bold text-gray-700 mb-2">المبلغ (د.ع)</label>
                    <div class="relative">
                       <input type="number" v-model="walletAmount" class="w-full px-4 py-3.5 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:ring-2 focus:ring-primary-500 transition-all outline-none font-bold text-left dir-ltr" placeholder="0">
                       <span class="absolute left-4 top-3.5 text-gray-400 text-sm font-bold">د.ع</span>
                    </div>
                 </div>
                 
                 <div class="grid grid-cols-2 gap-3 pt-2">
                    <button @click="updateWallet('credit')" class="py-3 bg-green-500 text-white rounded-xl font-bold hover:bg-green-600 transition-colors flex items-center justify-center gap-2">
                       <Plus class="w-5 h-5" />
                       إضافة
                    </button>
                    <button @click="updateWallet('debit')" class="py-3 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600 transition-colors flex items-center justify-center gap-2">
                       <Minus class="w-5 h-5" />
                       خصم
                    </button>
                 </div>
              </div>
              
              <button @click="closeWalletModal" class="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                 <X class="w-6 h-6" />
              </button>
           </div>
        </div>
      </div>
    </Teleport>

    <!-- Add Category Modal -->
    <Teleport to="body">
      <div v-if="showCategoryModal" class="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6" dir="rtl">
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" @click="showCategoryModal = false"></div>
        <div class="bg-white rounded-3xl w-full max-w-md p-6 relative z-10 animate-slide-up shadow-2xl">
           <h3 class="text-xl font-bold text-gray-900 mb-4">إضافة تصنيف جديد</h3>
           <div class="space-y-4">
              <div>
                 <label class="block text-sm font-bold text-gray-700 mb-2">اسم التصنيف</label>
                 <input v-model="newCategory.name" class="w-full px-4 py-3 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:ring-2 focus:ring-primary-500 transition-all outline-none font-medium">
              </div>
              <button @click="addCategory" class="w-full py-3 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 transition-colors">إضافة</button>
           </div>
           <button @click="showCategoryModal = false" class="absolute top-4 left-4 p-2 rounded-full hover:bg-gray-100">
              <X class="w-5 h-5 text-gray-500" />
           </button>
        </div>
      </div>
    </Teleport>

    <!-- Add Banner Modal -->
    <Teleport to="body">
      <div v-if="showBannerModal" class="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6" dir="rtl">
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" @click="showBannerModal = false"></div>
        <div class="bg-white rounded-3xl w-full max-w-md p-6 relative z-10 animate-slide-up shadow-2xl">
           <h3 class="text-xl font-bold text-gray-900 mb-4">إضافة إعلان جديد</h3>
           <div class="space-y-4">
              <div>
                 <label class="block text-sm font-bold text-gray-700 mb-2">العنوان الرئيسي</label>
                 <input v-model="newBanner.title" class="w-full px-4 py-3 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:ring-2 focus:ring-primary-500 transition-all outline-none font-medium">
              </div>
              <div>
                 <label class="block text-sm font-bold text-gray-700 mb-2">العنوان الفرعي</label>
                 <input v-model="newBanner.subtitle" class="w-full px-4 py-3 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:ring-2 focus:ring-primary-500 transition-all outline-none font-medium">
              </div>
              <div class="grid grid-cols-2 gap-4">
                 <div>
                    <label class="block text-sm font-bold text-gray-700 mb-2">لون البداية</label>
                    <select v-model="newBanner.colorFrom" class="w-full px-4 py-3 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:ring-2 focus:ring-primary-500 transition-all outline-none font-medium dir-ltr">
                       <option value="violet-600">Violet</option>
                       <option value="pink-500">Pink</option>
                       <option value="blue-500">Blue</option>
                       <option value="green-500">Green</option>
                       <option value="orange-500">Orange</option>
                    </select>
                 </div>
                 <div>
                    <label class="block text-sm font-bold text-gray-700 mb-2">لون النهاية</label>
                     <select v-model="newBanner.colorTo" class="w-full px-4 py-3 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:ring-2 focus:ring-primary-500 transition-all outline-none font-medium dir-ltr">
                       <option value="indigo-600">Indigo</option>
                       <option value="rose-500">Rose</option>
                       <option value="sky-500">Sky</option>
                       <option value="emerald-500">Emerald</option>
                       <option value="red-500">Red</option>
                    </select>
                 </div>
              </div>
              <button @click="addBanner" class="w-full py-3 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 transition-colors">إضافة</button>
           </div>
           <button @click="showBannerModal = false" class="absolute top-4 left-4 p-2 rounded-full hover:bg-gray-100">
              <X class="w-5 h-5 text-gray-500" />
           </button>
        </div>
      </div>
    </Teleport>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { 
  LayoutDashboard, LogOut, Package, ShoppingBag, 
  Plus, Trash2, Search, X, ScanBarcode, PackageX, Inbox, User, Menu, Home, Settings, Users, Minus, Wallet, Upload, Edit,
  LayoutList, Image as ImageIcon, Bell
} from 'lucide-vue-next'
import { useAppStore } from '../../store/app'
import { useAuthStore } from '../../store/auth'
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

const router = useRouter()
const appStore = useAppStore()
const authStore = useAuthStore()

onMounted(() => {
  appStore.fetchProducts()
  appStore.fetchOrders()
  appStore.fetchSettings()
  fetchUsers()
})

const activeTab = ref('products')
const showAddModal = ref(false)
const showSidebar = ref(false)
const searchQuery = ref('')

const switchTab = (tab) => {
  activeTab.value = tab
  showSidebar.value = false
}

// Settings Logic
const settings = computed(() => appStore.settings || {})

const saveSettings = () => {
  appStore.updateSettings(settings.value)
}

const toggleStoreStatus = () => {
  const newStatus = !settings.value.isStoreOpen
  appStore.updateSettings({ ...settings.value, isStoreOpen: newStatus })
}

const outOfStockProducts = computed(() => appStore.products.filter(p => !p.isAvailable))
const inStockProducts = computed(() => appStore.products.filter(p => p.isAvailable !== false))

// Users & Wallet
const usersList = ref([])
const showWalletModal = ref(false)
const selectedUser = ref(null)
const walletAmount = ref('')

const fetchUsers = async () => {
  try {
    const res = await fetch('http://localhost:3001/api/users')
    if (res.ok) {
      usersList.value = await res.json()
    }
  } catch (e) {
    console.error(e)
  }
}

const openWalletModal = (user) => {
  selectedUser.value = user
  walletAmount.value = ''
  showWalletModal.value = true
}

const closeWalletModal = () => {
  showWalletModal.value = false
  selectedUser.value = null
}

const updateWallet = async (type) => {
  if (!walletAmount.value || walletAmount.value <= 0) return
  
  try {
    const res = await fetch(`${SERVER_URL}/api/users/${selectedUser.value.id}/wallet`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({
        amount: walletAmount.value,
        type
      })
    })
    
    if (res.ok) {
      const data = await res.json()
      // Update local list
      const idx = usersList.value.findIndex(u => u.id === data.user.id)
      if (idx !== -1) usersList.value[idx] = data.user
      
      // If updating self, update auth store
      if (data.user.id === authStore.user.id) {
        authStore.updateUser(data.user)
      }
      
      closeWalletModal()
    }
  } catch (e) {
    console.error(e)
  }
}

const newProduct = ref({
  id: null,
  name: '',
  price: null,
  quantity: 0,
  discountPrice: null,
  barcode: '',
  images: [],
  isAvailable: true
})

const handleImageUpload = (event) => {
  const files = event.target.files
  if (!files) return

  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    const reader = new FileReader()
    
    reader.onload = (e) => {
      newProduct.value.images.push(e.target.result)
    }
    
    reader.readAsDataURL(file)
  }
}

const removeImage = (index) => {
  newProduct.value.images.splice(index, 1)
}

// Chart Data
const chartData = {
  labels: ['السبت', 'الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة'],
  datasets: [
    {
      label: 'الطلبات',
      backgroundColor: '#8b5cf6',
      data: [4, 7, 2, 9, 5, 8, 3], // Dummy data
      borderRadius: 8,
      barThickness: 12
    }
  ]
}

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false }
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: {
        display: true,
        drawBorder: false,
        color: '#f3f4f6'
      },
      ticks: {
        font: { family: 'Tajawal' }
      }
    },
    x: {
      grid: { display: false },
      ticks: {
        font: { family: 'Tajawal' }
      }
    }
  }
}

const filteredProducts = computed(() => {
  if (!searchQuery.value) return appStore.products
  const query = searchQuery.value.toLowerCase()
  return appStore.products.filter(p => 
    p.name.toLowerCase().includes(query) || 
    p.barcode.includes(query)
  )
})

const openAddModal = () => {
  newProduct.value = {
    id: null,
    name: '',
    price: null,
    quantity: 0,
    discountPrice: null,
    barcode: '',
    images: [],
    categoryId: null,
    isAvailable: true
  }
  showAddModal.value = true
}

const openEditModal = (product) => {
  newProduct.value = {
    ...product,
    // Ensure these fields exist
    discountPrice: product.discountPrice || null,
    quantity: product.quantity || 0,
    images: product.images || [],
    categoryId: product.categoryId || null
  }
  showAddModal.value = true
}

const addProduct = async () => {
  if (!newProduct.value.name || !newProduct.value.price) return

  try {
    await appStore.addProduct({
      ...newProduct.value,
      category: newProduct.value.category || 'عام'
    })
    
    showAddModal.value = false
    openAddModal() // Reset form
  } catch (e) {
    console.error(e)
  }
}

const deleteProduct = (id) => {
  if(confirm('هل أنت متأكد من حذف هذا المنتج؟')) {
    appStore.deleteProduct(id)
  }
}

const toggleAvailability = (product) => {
   appStore.toggleProductAvailability(product)
}

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}

const getStatusLabel = (status) => {
  switch (status) {
    case 'pending': return 'قيد الانتظار'
    case 'accepted': return 'مقبول'
    case 'rejected': return 'مرفوض'
    case 'completed': return 'مكتمل'
    default: return status
  }
}

const getStatusClass = (status) => {
  switch (status) {
    case 'pending': return 'bg-yellow-50 text-yellow-600'
    case 'accepted': return 'bg-blue-50 text-blue-600'
    case 'rejected': return 'bg-red-50 text-red-600'
    case 'completed': return 'bg-green-50 text-green-600'
    default: return 'bg-gray-50 text-gray-600'
  }
}
</script>

<style scoped>
@keyframes slide-right {
   from { transform: translateX(100%); opacity: 0; }
   to { transform: translateX(0); opacity: 1; }
}
.animate-slide-right {
   animation: slide-right 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
</style>