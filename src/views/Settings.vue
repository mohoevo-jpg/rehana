<template>
  <div class="h-full flex flex-col space-y-4">
    <h2 class="text-2xl font-bold text-gray-900 dark:text-white px-2">{{ t('settings.title') }}</h2>

    <div class="flex-1 bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden flex flex-col md:flex-row">
      <!-- Sidebar Tabs -->
      <div class="w-full md:w-64 bg-gray-50 dark:bg-gray-900 border-l border-gray-200 dark:border-gray-700 flex flex-row md:flex-col overflow-x-auto md:overflow-visible">
        <button 
          v-for="tab in tabs" 
          :key="tab.id"
          @click="activeTab = tab.id"
          :class="[
            'flex items-center gap-3 px-6 py-4 text-sm font-medium transition-colors whitespace-nowrap',
            activeTab === tab.id 
              ? 'bg-white dark:bg-gray-800 text-primary-600 dark:text-primary-400 border-r-4 border-primary-600 shadow-sm' 
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
          ]"
        >
          <component :is="tab.icon" class="w-5 h-5" />
          {{ tab.name }}
        </button>
      </div>

      <!-- Content Area -->
      <div class="flex-1 p-6 overflow-y-auto">
        
        <!-- General Settings -->
        <div v-if="activeTab === 'general'" class="space-y-6 max-w-2xl animate-fade-in">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white border-b dark:border-gray-700 pb-2 mb-4">{{ t('settings.general_section.title') }}</h3>
          <div class="grid grid-cols-1 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ t('settings.general_section.shop_name') }}</label>
              <input v-model="settings.shopName" type="text" class="input-field">
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ t('settings.general_section.phone') }}</label>
                <input v-model="settings.phone" type="text" class="input-field">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ t('settings.general_section.email') }}</label>
                <input v-model="settings.email" type="email" class="input-field">
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ t('settings.general_section.address') }}</label>
              <textarea v-model="settings.address" rows="3" class="input-field"></textarea>
            </div>

            <!-- Social Media -->
            <div class="border-t pt-4 mt-4">
              <h4 class="text-sm font-medium text-gray-900 dark:text-white mb-4">وسائل التواصل الاجتماعي</h4>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">فيسبوك</label>
                  <input v-model="settings.facebookUrl" type="text" class="input-field" placeholder="رابط الصفحة">
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">انستغرام</label>
                  <input v-model="settings.instagramUrl" type="text" class="input-field" placeholder="رابط الحساب">
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">تيليجرام</label>
                  <input v-model="settings.telegramUrl" type="text" class="input-field" placeholder="معرف القناة/الحساب">
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">الموقع الإلكتروني</label>
                  <input v-model="settings.websiteUrl" type="text" class="input-field" placeholder="www.example.com">
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Rewards Settings -->
        <div v-if="activeTab === 'rewards'" class="space-y-6 max-w-2xl animate-fade-in">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white border-b dark:border-gray-700 pb-2 mb-4">نظام المكافآت والولاء</h3>
          
          <div class="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg p-6 space-y-6">
            <div class="flex items-center justify-between">
              <div>
                <h4 class="text-base font-bold text-gray-900 dark:text-white">تفعيل نظام المكافآت</h4>
                <p class="text-sm text-gray-500 dark:text-gray-400">منح رصيد مجاني للعملاء عند تجاوز قيمة مشتريات معينة</p>
              </div>
              <div class="flex items-center gap-2" v-if="settings.rewardSystem">
                <input v-model="settings.rewardSystem.active" type="checkbox" id="rewardActive" class="toggle-checkbox">
              </div>
            </div>

            <div v-if="settings.rewardSystem && settings.rewardSystem.active" class="space-y-4 animate-fade-in pt-4 border-t">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">الحد الأدنى للطلب (د.ع)</label>
                  <input v-model.number="settings.rewardSystem.threshold" type="number" class="input-field" placeholder="35000">
                  <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">المبلغ الذي يجب أن يتجاوزه الطلب للحصول على المكافأة</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">قيمة المكافأة (د.ع)</label>
                  <input v-model.number="settings.rewardSystem.amount" type="number" class="input-field" placeholder="1000">
                  <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">المبلغ الذي سيتم إضافته لمحفظة العميل</p>
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">رسالة التهنئة</label>
                <textarea v-model="settings.rewardSystem.message" rows="3" class="input-field" placeholder="نص الرسالة التي ستصل للعميل..."></textarea>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">ستظهر هذه الرسالة للعميل عند حصوله على المكافأة</p>
              </div>

              <div class="bg-blue-50 p-4 rounded-lg border border-blue-100 flex items-start gap-3">
                <Gift class="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h5 class="text-sm font-bold text-blue-800">معاينة التنبيه</h5>
                  <p class="text-sm text-blue-700 mt-1">"{{ settings.rewardSystem.message }}"</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Registration Welcome Bonus -->
          <div class="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg p-6 space-y-6">
            <div class="flex items-center justify-between">
              <div>
                <h4 class="text-base font-bold text-gray-900 dark:text-white">هدية التسجيل (الترحيب)</h4>
                <p class="text-sm text-gray-500 dark:text-gray-400">رصيد مجاني يمنح للمستخدم الجديد عند إنشاء الحساب</p>
              </div>
            </div>

            <div class="space-y-4 animate-fade-in pt-4 border-t">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">قيمة الرصيد الترحيبي (د.ع)</label>
                <input v-model.number="settings.welcomeBonus" type="number" class="input-field" placeholder="3000">
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">رسالة الترحيب</label>
                <textarea v-model="settings.welcomeMessage" rows="3" class="input-field" placeholder="نص الرسالة التي ستظهر للمستخدم عند التسجيل..."></textarea>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">يمكنك استخدام {amount} لاستبدالها بقيمة الرصيد تلقائياً</p>
              </div>

              <div class="bg-green-50 p-4 rounded-lg border border-green-100 flex items-start gap-3">
                <Gift class="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <h5 class="text-sm font-bold text-green-800">معاينة رسالة الترحيب</h5>
                  <p class="text-sm text-green-700 mt-1 whitespace-pre-wrap">"{{ (settings.welcomeMessage || '').replace('{amount}', (settings.welcomeBonus || 0).toLocaleString()) }}"</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Campaigns & Manual Rewards -->
          <div class="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg p-6 space-y-6">
            <div class="flex items-center justify-between border-b pb-4">
              <div>
                <h4 class="text-base font-bold text-gray-900 dark:text-white">الحملات والرسائل الترويجية</h4>
                <p class="text-sm text-gray-500 dark:text-gray-400">إنشاء حملات مكافآت أو رسائل ترويجية لمجموعات محددة من المستخدمين</p>
              </div>
              <button @click="openCreateCampaign" class="btn-primary flex items-center gap-2 text-sm">
                <Plus class="w-4 h-4" />
                حملة جديدة
              </button>
            </div>

            <div class="space-y-4">
              <div v-if="campaignsError" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
                <span class="block sm:inline">{{ campaignsError }}</span>
              </div>

              <div v-for="campaign in campaigns" :key="campaign.id" class="border rounded-lg p-4 bg-gray-50 hover:bg-gray-100 transition-colors">
                <div class="flex justify-between items-start">
                  <div>
                    <h5 class="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                      {{ campaign.title }}
                      <span v-if="campaign.status === 'sent'" class="px-2 py-0.5 text-xs rounded-full bg-green-100 text-green-800 flex items-center gap-1">
                        <CheckCircle class="w-3 h-3" /> تم الإرسال
                      </span>
                      <span v-else class="px-2 py-0.5 text-xs rounded-full bg-yellow-100 text-yellow-800">
                        مسودة
                      </span>
                    </h5>
                    <p class="text-sm text-gray-600 dark:text-gray-300 mt-1">{{ campaign.message }}</p>
                    <div class="flex gap-4 mt-2 text-xs text-gray-500">
                      <span v-if="campaign.amount > 0" class="flex items-center gap-1 text-green-600 font-bold"><Gift class="w-3 h-3" /> {{ campaign.amount }} د.ع</span>
                      <span v-else class="flex items-center gap-1 text-blue-600 font-bold"><MessageCircle class="w-3 h-3" /> رسالة ترويجية</span>
                      
                      <span class="flex items-center gap-1"><Users class="w-3 h-3" /> 
                        {{ campaign.targetType === 'all' ? 'جميع المستخدمين' : 
                           campaign.targetType === 'specific' ? 'مستخدمين محددين' : 
                           campaign.targetType === 'most_active' ? 'الأكثر طلباً' : 'الأقل نشاطاً' }}
                      </span>
                      <span v-if="campaign.status === 'sent'" class="flex items-center gap-1">
                        <CheckCircle class="w-3 h-3" /> تم الإرسال لـ {{ campaign.beneficiariesCount }} مستخدم
                      </span>
                    </div>
                  </div>
                  <div class="flex items-center gap-2">
                    <button v-if="campaign.status !== 'sent'" @click="openEditCampaign(campaign)" class="text-blue-600 hover:text-blue-900 p-1" title="تعديل">
                      <Edit class="w-4 h-4" />
                    </button>
                    <button v-if="campaign.status !== 'sent'" @click="sendCampaign(campaign.id)" class="text-green-600 hover:text-green-900 p-1" title="إرسال الآن">
                      <Send class="w-4 h-4" />
                    </button>
                    <button @click="deleteCampaign(campaign.id)" class="text-red-600 hover:text-red-900 p-1" title="حذف">
                      <Trash2 class="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              <div v-if="campaigns.length === 0" class="text-center py-8 text-gray-500 text-sm">
                لا توجد حملات حالياً. ابدأ بإنشاء حملة جديدة!
              </div>
            </div>
          </div>
        </div>

        <!-- Appearance Settings -->
        <div v-if="activeTab === 'appearance'" class="space-y-6 max-w-2xl animate-fade-in">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white border-b dark:border-gray-700 pb-2 mb-4">{{ t('settings.appearance_section.title') }}</h3>
          
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ t('settings.appearance_section.language') }}</label>
              <select v-model="settings.language" class="input-field">
                <option value="ar">العربية</option>
                <option value="en">English</option>
                <option value="ku">Kurdish</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ t('settings.appearance_section.currency') }}</label>
              <div class="grid grid-cols-2 gap-4">
                <select v-model="settings.currency" class="input-field">
                  <option value="IQD">دينار عراقي (IQD)</option>
                  <option value="USD">دولار أمريكي (USD)</option>
                  <option value="EUR">يورو (EUR)</option>
                </select>
                <select v-model="settings.currencyLocale" class="input-field">
                  <option value="ar-IQ">تنسيق عراقي (١,٠٠٠ د.ع)</option>
                  <option value="en-US">تنسيق عالمي ($1,000)</option>
                </select>
              </div>
            </div>

            <div class="pt-4">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">{{ t('settings.appearance_section.primary_color') }}</label>
              <div class="flex gap-4">
                <button 
                  v-for="color in colors" 
                  :key="color.value"
                  @click="settings.primaryColor = color.value"
                  :class="[
                    'w-10 h-10 rounded-full border-2 transition-transform hover:scale-110',
                    settings.primaryColor === color.value ? 'border-gray-900 dark:border-white scale-110' : 'border-transparent'
                  ]"
                  :style="{ backgroundColor: color.value }"
                  :title="color.name"
                ></button>
              </div>
            </div>

            <div class="pt-4 flex items-center justify-between">
              <span class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ t('settings.appearance_section.dark_mode') }}</span>
              <button 
                @click="toggleTheme"
                :class="[
                  settings.theme === 'dark' ? 'bg-primary-600' : 'bg-gray-200',
                  'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none'
                ]"
              >
                <span 
                  :class="[
                    settings.theme === 'dark' ? '-translate-x-5' : 'translate-x-0',
                    'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out'
                  ]"
                ></span>
              </button>
            </div>
          </div>
        </div>

        <!-- App Users Settings -->
        <div v-if="activeTab === 'app_users'" class="space-y-6 animate-fade-in">
          <div class="flex justify-between items-center border-b pb-4">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">إدارة مستخدمين التطبيق</h3>
            <button @click="fetchUsers" class="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1">
              <RefreshCw class="w-4 h-4" />
              تحديث القائمة
            </button>
          </div>

          <div class="bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700 overflow-hidden">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">المستخدم</th>
                  <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">رقم الهاتف</th>
                  <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">رصيد المحفظة</th>
                  <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">الإجراءات</th>
                </tr>
              </thead>
              <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                <tr v-for="user in appUsers" :key="user.id">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <div class="h-10 w-10 flex-shrink-0">
                        <div class="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold">
                          {{ user.name.charAt(0) }}
                        </div>
                      </div>
                      <div class="mr-4">
                        <div class="text-sm font-medium text-gray-900 dark:text-white">{{ user.name }}</div>
                        <div class="text-sm text-gray-500 dark:text-gray-400">{{ user.email }}</div>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {{ user.phone }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white font-bold">
                    {{ (user.walletBalance || 0).toLocaleString() }} د.ع
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div class="flex items-center gap-2">
                      <button @click="openEditUser(user)" class="text-blue-600 hover:text-blue-900 p-1">
                        <Edit class="w-4 h-4" />
                      </button>
                      <button @click="deleteUser(user.id)" class="text-red-600 hover:text-red-900 p-1">
                        <Trash2 class="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
                <tr v-if="appUsers.length === 0">
                  <td colspan="4" class="px-6 py-12 text-center text-gray-500">
                    لا يوجد مستخدمين مسجلين حالياً
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Cashier Users Settings -->
        <div v-if="activeTab === 'cashier_users'" class="space-y-6 animate-fade-in">
          <div class="flex justify-between items-center border-b pb-4">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">إدارة مستخدمين الكاشير</h3>
            <button @click="openAddUser('admin')" class="btn-primary flex items-center gap-2 text-sm">
              <Plus class="w-4 h-4" />
              إضافة مستخدم جديد
            </button>
          </div>

          <div class="bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700 overflow-hidden">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">الاسم</th>
                  <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">معلومات الاتصال</th>
                  <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">الصلاحية</th>
                  <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">الإجراءات</th>
                </tr>
              </thead>
              <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                <tr v-for="user in cashierUsers" :key="user.id">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <div class="h-10 w-10 flex-shrink-0">
                        <div class="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 font-bold">
                          {{ user.name.charAt(0) }}
                        </div>
                      </div>
                      <div class="mr-4">
                        <div class="text-sm font-medium text-gray-900 dark:text-white">{{ user.name }}</div>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    <div class="flex flex-col">
                      <span>{{ user.phone }}</span>
                      <span class="text-xs">{{ user.email }}</span>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      {{ user.role === 'admin' ? 'مدير النظام' : 'كاشير' }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div class="flex items-center gap-2">
                      <button @click="openEditUser(user)" class="text-blue-600 hover:text-blue-900 p-1">
                        <Edit class="w-4 h-4" />
                      </button>
                      <button @click="deleteUser(user.id)" class="text-red-600 hover:text-red-900 p-1">
                        <Trash2 class="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Invoices Settings -->
        <div v-if="activeTab === 'invoices'" class="space-y-6 animate-fade-in">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white border-b dark:border-gray-700 pb-2 mb-4">{{ t('settings.invoices_section.title') }}</h3>
          
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <!-- Settings Form -->
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ t('settings.invoices_section.default_printer') }}</label>
                <select v-model="settings.printerName" class="input-field">
                  <option :value="null">{{ t('settings.invoices_section.select_printer') }}</option>
                  <option value="printer1">Thermal Printer 80mm</option>
                  <option value="printer2">Microsoft Print to PDF</option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ t('settings.invoices_section.header') }}</label>
                <input v-model="settings.invoiceHeader" type="text" class="input-field" placeholder="نص يظهر أعلى الفاتورة">
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ t('settings.invoices_section.footer') }}</label>
                <input v-model="settings.invoiceFooter" type="text" class="input-field" placeholder="نص يظهر أسفل الفاتورة (مثل: شكراً لزيارتكم)">
              </div>

              <!-- Invoice Design Options -->
              <div class="border-t pt-4 mt-4 space-y-4">
                <h4 class="text-sm font-medium text-gray-900 dark:text-white">تصميم الفاتورة</h4>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">شعار الفاتورة</label>
                  <div class="flex items-center gap-4">
                    <div v-if="settings.invoiceLogoUrl" class="w-16 h-16 border rounded p-1 flex items-center justify-center bg-gray-50">
                      <img :src="settings.invoiceLogoUrl" class="max-w-full max-h-full object-contain">
                    </div>
                    <div class="flex-1">
                      <input type="file" @change="handleLogoUpload" accept="image/*" class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100">
                      <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">يفضل استخدام صورة مربعة أو شفافة (PNG)</p>
                    </div>
                    <button v-if="settings.invoiceLogoUrl" @click="settings.invoiceLogoUrl = ''" class="text-red-500 hover:text-red-700 text-sm">حذف</button>
                  </div>
                </div>

                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">حجم الورق</label>
                    <select v-model="settings.invoicePaperSize" class="input-field">
                      <option value="80mm">طابعة حرارية 80mm</option>
                      <option value="58mm">طابعة حرارية 58mm</option>
                      <option value="A4">ورق A4</option>
                      <option value="A5">ورق A5</option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">حجم الخط ({{ settings.invoiceFontSize }})</label>
                    <input v-model.number="settings.invoiceFontSize" type="range" min="8" max="16" step="1" class="w-full">
                  </div>
                </div>

                <div class="space-y-2">
                  <div class="flex items-center gap-2">
                    <input v-model="settings.showLogoOnInvoice" type="checkbox" id="showLogo" class="rounded text-primary-600 focus:ring-primary-500">
                    <label for="showLogo" class="text-sm text-gray-700">{{ t('settings.invoices_section.show_logo') }}</label>
                  </div>
                  <div class="flex items-center gap-2">
                    <input v-model="settings.showCashierName" type="checkbox" id="showCashier" class="rounded text-primary-600 focus:ring-primary-500">
                    <label for="showCashier" class="text-sm text-gray-700">عرض اسم الكاشير</label>
                  </div>
                  <div class="flex items-center gap-2">
                    <input v-model="settings.showCustomerInfo" type="checkbox" id="showCustomer" class="rounded text-primary-600 focus:ring-primary-500">
                    <label for="showCustomer" class="text-sm text-gray-700">عرض بيانات العميل</label>
                  </div>
                  <div class="flex items-center gap-2">
                    <input v-model="settings.showSocialMediaOnInvoice" type="checkbox" id="showSocials" class="rounded text-primary-600 focus:ring-primary-500">
                    <label for="showSocials" class="text-sm text-gray-700">عرض وسائل التواصل في التذييل</label>
                  </div>
                </div>
              </div>
              
              <div class="pt-4">
                <button class="btn-secondary w-full sm:w-auto">
                  {{ t('settings.invoices_section.print_test') }}
                </button>
              </div>
            </div>

            <!-- Live Preview -->
            <div class="bg-gray-200 p-6 rounded-lg flex flex-col items-center justify-center min-h-[500px]">
              <h4 class="text-sm font-bold text-gray-600 mb-6">معاينة حية للفاتورة</h4>
              <div class="transform scale-95 sm:scale-100 transition-transform">
                <InvoicePreview :settings="settings" />
              </div>
            </div>
          </div>
        </div>

        <!-- Barcode Settings -->
        <div v-if="activeTab === 'barcode'" class="space-y-6 max-w-2xl animate-fade-in">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white border-b dark:border-gray-700 pb-2 mb-4">إعدادات الباركود</h3>
          
          <div class="space-y-4">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">نوع الباركود</label>
                <select v-model="settings.barcodeFormat" class="input-field">
                  <option value="CODE128">CODE128 (افتراضي)</option>
                  <option value="CODE39">CODE39</option>
                  <option value="EAN13">EAN13</option>
                  <option value="UPC">UPC</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">عرض الخط ({{ settings.barcodeWidth }})</label>
                <input v-model.number="settings.barcodeWidth" type="range" min="1" max="4" step="1" class="w-full">
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">الارتفاع ({{ settings.barcodeHeight }})</label>
                <input v-model.number="settings.barcodeHeight" type="range" min="30" max="150" step="5" class="w-full">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">حجم الخط ({{ settings.barcodeFontSize }})</label>
                <input v-model.number="settings.barcodeFontSize" type="range" min="10" max="30" step="1" class="w-full">
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                 <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">الهوامش ({{ settings.barcodeMargin }})</label>
                 <input v-model.number="settings.barcodeMargin" type="range" min="0" max="50" step="1" class="w-full">
              </div>
              <div class="flex items-center gap-2 mt-8">
                <input v-model="settings.barcodeShowText" type="checkbox" id="showText" class="rounded text-primary-600 focus:ring-primary-500">
                <label for="showText" class="text-sm text-gray-700">عرض النص تحت الباركود</label>
              </div>
            </div>

            <!-- Preview -->
            <div class="mt-8 p-6 border rounded-lg bg-gray-50 flex flex-col items-center justify-center">
              <h4 class="text-sm font-medium text-gray-500 mb-4">معاينة الباركود</h4>
              <BarcodePreview :settings="settings" value="1234567890" />
            </div>
          </div>
        </div>

        <!-- Report Settings -->
        <div v-if="activeTab === 'reports'" class="space-y-6 max-w-2xl animate-fade-in">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white border-b dark:border-gray-700 pb-2 mb-4">إعدادات التقارير</h3>
          
          <div class="space-y-6">
            <!-- Header & Footer -->
            <div class="space-y-4">
              <h4 class="text-sm font-medium text-gray-900 dark:text-white">الترويسة والتذييل</h4>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">عنوان التقرير</label>
                <input v-model="settings.reportHeaderTitle" type="text" class="input-field" placeholder="مثل: تقرير المبيعات">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">نص التذييل</label>
                <input v-model="settings.reportFooterText" type="text" class="input-field" placeholder="مثل: تم استخراج التقرير من نظام...">
              </div>
            </div>

            <!-- Appearance -->
            <div class="space-y-4">
              <h4 class="text-sm font-medium text-gray-900 dark:text-white">المظهر والألوان</h4>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">لون التقرير الأساسي</label>
                <div class="flex gap-4">
                  <button 
                    v-for="color in colors" 
                    :key="color.value + '_report'"
                    @click="settings.reportPrimaryColor = color.value"
                    :class="[
                      'w-8 h-8 rounded-full border-2 transition-transform hover:scale-110',
                      settings.reportPrimaryColor === color.value ? 'border-gray-900 scale-110' : 'border-transparent'
                    ]"
                    :style="{ backgroundColor: color.value }"
                  ></button>
                </div>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">حجم الخط ({{ settings.reportFontSize }})</label>
                  <input v-model.number="settings.reportFontSize" type="range" min="10" max="24" step="1" class="w-full">
                </div>
                <div>
                   <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">لون الحدود</label>
                   <input v-model="settings.reportBorderColor" type="color" class="h-10 w-full rounded border border-gray-300 p-1">
                </div>
              </div>
            </div>

            <!-- Options -->
            <div class="space-y-4">
              <h4 class="text-sm font-medium text-gray-900 dark:text-white">خيارات العرض</h4>
              <div class="space-y-2">
                <div class="flex items-center gap-2">
                  <input v-model="settings.reportShowLogo" type="checkbox" id="reportShowLogo" class="rounded text-primary-600 focus:ring-primary-500">
                  <label for="reportShowLogo" class="text-sm text-gray-700">عرض الشعار في الترويسة</label>
                </div>
                <div class="flex items-center gap-2">
                  <input v-model="settings.reportShowDate" type="checkbox" id="reportShowDate" class="rounded text-primary-600 focus:ring-primary-500">
                  <label for="reportShowDate" class="text-sm text-gray-700">عرض تاريخ التقرير</label>
                </div>
              </div>
            </div>

            <!-- Preview Button -->
            <div class="pt-4">
              <button @click="showReportPreview = true" class="btn-secondary w-full flex items-center justify-center gap-2">
                <Printer class="w-4 h-4" />
                معاينة نموذج التقرير
              </button>
            </div>
          </div>
        </div>

        <!-- Updates Settings -->
        <div v-if="activeTab === 'updates'" class="space-y-6 max-w-2xl animate-fade-in">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white border-b dark:border-gray-700 pb-2 mb-4">تحديثات النظام</h3>
          
          <div class="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg p-6 flex flex-col items-center text-center space-y-4">
            <div class="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center text-primary-600 mb-2">
              <RefreshCw v-if="updateStatus === 'checking' || updateStatus === 'downloading'" class="w-8 h-8 animate-spin" />
              <Download v-else-if="updateStatus === 'available'" class="w-8 h-8" />
              <CheckCircle v-else-if="updateStatus === 'downloaded' || updateStatus === 'not-available'" class="w-8 h-8" />
              <XCircle v-else-if="updateStatus === 'error'" class="w-8 h-8 text-red-500" />
              <SettingsIcon v-else class="w-8 h-8" />
            </div>

            <div>
              <h4 class="text-lg font-bold text-gray-900 dark:text-white">الإصدار الحالي: {{ appVersion }}</h4>
              <p v-if="updateStatus === 'idle'" class="text-gray-500 mt-1">اضغط للتحقق من وجود تحديثات جديدة</p>
              <p v-if="updateStatus === 'checking'" class="text-gray-500 mt-1">جاري التحقق من التحديثات...</p>
              <p v-if="updateStatus === 'not-available'" class="text-green-600 mt-1">برنامجك محدث لآخر إصدار</p>
              <p v-if="updateStatus === 'available'" class="text-primary-600 mt-1 font-medium">يتوفر إصدار جديد {{ updateInfo?.version }}</p>
              <p v-if="updateStatus === 'downloading'" class="text-primary-600 mt-1">جاري تنزيل التحديث... {{ downloadProgress }}%</p>
              <p v-if="updateStatus === 'downloaded'" class="text-green-600 mt-1 font-bold">تم تنزيل التحديث بنجاح</p>
              <p v-if="updateStatus === 'error'" class="text-red-600 mt-1">حدث خطأ أثناء التحديث: {{ errorMessage }}</p>
            </div>

            <!-- Progress Bar -->
            <div v-if="updateStatus === 'downloading'" class="w-full max-w-md bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mt-4">
              <div class="bg-primary-600 h-2.5 rounded-full" :style="{ width: downloadProgress + '%' }"></div>
            </div>

            <!-- Actions -->
            <div class="pt-4 flex gap-4">
              <button 
                v-if="updateStatus === 'idle' || updateStatus === 'not-available' || updateStatus === 'error'" 
                @click="checkForUpdate" 
                class="btn-primary flex items-center gap-2"
                :disabled="updateStatus === 'checking'"
              >
                <RefreshCw class="w-4 h-4" :class="{ 'animate-spin': updateStatus === 'checking' }" />
                {{ updateStatus === 'checking' ? 'جاري التحقق...' : 'تحقق من التحديثات' }}
              </button>

              <button 
                v-if="updateStatus === 'available'" 
                @click="downloadUpdate" 
                class="btn-primary flex items-center gap-2"
              >
                <Download class="w-4 h-4" />
                تنزيل التحديث
              </button>

              <button 
                v-if="updateStatus === 'downloaded'" 
                @click="installUpdate" 
                class="btn-primary flex items-center gap-2"
              >
                <RefreshCw class="w-4 h-4" />
                تثبيت وإعادة التشغيل
              </button>
            </div>
            
            <p class="text-xs text-gray-400 mt-4 max-w-sm">
              ملاحظة: عند التحديث، سيتم الاحتفاظ بجميع إعداداتك وبياناتك كما هي ولن تفقد أي شيء.
            </p>

             <!-- Desktop Update URL Configuration (Advanced) -->
             <div class="w-full mt-6 border-t pt-4">
               <button @click="showAdvancedUpdate = !showAdvancedUpdate" class="text-xs text-gray-500 hover:text-primary-600 underline flex items-center gap-1 mx-auto">
                 <span>إعدادات متقدمة (رابط التحديث)</span>
               </button>
               
               <div v-if="showAdvancedUpdate" class="mt-2 animate-fade-in">
                 <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 text-right">رابط سيرفر التحديثات (Desktop Update URL)</label>
                 <div class="flex gap-2">
                   <input v-model="desktopUpdateUrl" type="text" class="input-field text-xs ltr" placeholder="https://example.com/updates/">
                   <button @click="checkForUpdate" class="btn-secondary text-xs px-2 whitespace-nowrap">حفظ وتحقق</button>
                 </div>
                 <p class="text-[10px] text-gray-400 mt-1 text-right">اتركه فارغاً لاستخدام الرابط الافتراضي المدمج في البرنامج.</p>
               </div>
            </div>

          </div>

          <!-- Mobile App Update Settings -->
          <div class="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg p-6 space-y-4 mt-6">
            <h4 class="text-lg font-bold text-gray-900 dark:text-white border-b dark:border-gray-700 pb-2">إعدادات تحديث تطبيق الموبايل</h4>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">أحدث إصدار (Latest Version)</label>
                <input v-model="settings.latestAppVersion" type="text" class="input-field" placeholder="1.0.0">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">أقل إصدار مدعوم (Min Version)</label>
                <input v-model="settings.minAppVersion" type="text" class="input-field" placeholder="1.0.0">
                <p class="text-xs text-red-500 mt-1">الإصدارات الأقدم من هذا الرقم ستجبر على التحديث.</p>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">رابط التحديث (Update URL)</label>
              <input v-model="settings.updateUrl" type="text" class="input-field" placeholder="https://play.google.com/store/apps/details?id=...">
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">رسالة التحديث</label>
              <textarea v-model="settings.updateMessage" rows="2" class="input-field" placeholder="نص الرسالة التي تظهر للمستخدم"></textarea>
            </div>

            <div class="pt-2">
              <button @click="saveMobileSettings" class="btn-secondary w-full">
                حفظ إعدادات التحديث
              </button>
            </div>
          </div>

          <!-- Announcements / Popups -->
          <div class="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg p-6 space-y-4 mt-6">
            <h4 class="text-lg font-bold text-gray-900 dark:text-white border-b dark:border-gray-700 pb-2">النوافذ المنبثقة والإعلانات</h4>
            
            <div class="flex items-center gap-2 mb-4" v-if="settings.announcement">
              <input v-model="settings.announcement.active" type="checkbox" id="announceActive" class="rounded text-primary-600 focus:ring-primary-500">
              <label for="announceActive" class="text-sm font-medium text-gray-900">تفعيل النافذة المنبثقة</label>
            </div>

            <div v-if="settings.announcement && settings.announcement.active" class="space-y-4 animate-fade-in">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">عنوان النافذة</label>
                <input v-model="settings.announcement.title" type="text" class="input-field" placeholder="تنبيه هام">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">محتوى الرسالة</label>
                <textarea v-model="settings.announcement.message" rows="3" class="input-field" placeholder="اكتب رسالتك هنا..."></textarea>
              </div>
            </div>

            <div class="pt-2">
              <button @click="saveMobileSettings" class="btn-secondary w-full">
                حفظ إعدادات الإعلان
              </button>
            </div>
          </div>
        </div>

        <!-- Server Management Settings -->
        <div v-if="activeTab === 'server'" class="space-y-6 animate-fade-in">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white border-b dark:border-gray-700 pb-2 mb-4">إدارة السيرفر والاتصال</h3>

          <!-- Server Status Card (Updated) -->
          <div class="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg p-6 mb-6">
            <h4 class="text-base font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <ServerIcon class="w-5 h-5 text-primary-600" />
              حالة السيرفر
            </h4>
            
            <div class="flex items-center gap-4 mb-4">
              <div class="relative flex h-3 w-3">
                <span v-if="isConnected" class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span :class="isConnected ? 'bg-green-500' : 'bg-red-500'" class="relative inline-flex rounded-full h-3 w-3"></span>
              </div>
              <span :class="isConnected ? 'text-green-600' : 'text-red-600'" class="font-bold text-lg">
                {{ isConnected ? 'متصل (Online)' : 'غير متصل (Offline)' }}
              </span>
            </div>

            <p class="text-sm text-gray-600 dark:text-gray-400 mb-4 bg-blue-50 dark:bg-blue-900/20 p-3 rounded border border-blue-100 dark:border-blue-800">
              <span class="font-bold block mb-1">💡 ملاحظة هامة:</span>
              أنت تعمل بنظام الاستضافة الذاتية (Self-Hosting). هذا يعني أن هذا الحاسوب هو السيرفر الرئيسي.
              <br>
              - عند فتح البرنامج، يعمل السيرفر تلقائياً.
              <br>
              - عند إغلاق البرنامج، قد يتوقف السيرفر.
              <br>
              - يجب أن يظل هذا الحاسوب يعمل لكي يتمكن بقية الموظفين من الدخول.
            </p>

            <div class="grid grid-cols-2 gap-4 mt-6 border-t pt-4">
               <div>
                 <span class="text-xs text-gray-500 block mb-1">عنوان الشبكة المحلية (Local IP)</span>
                 <code class="bg-gray-100 px-2 py-1 rounded text-sm font-mono select-all">{{ serverInfo.ip }}</code>
               </div>
               <div>
                 <span class="text-xs text-gray-500 block mb-1">المنفذ (Port)</span>
                 <code class="bg-gray-100 px-2 py-1 rounded text-sm font-mono">3001</code>
               </div>
            </div>
          </div>
          
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- Server Control Panel -->
            <div class="space-y-6">
              <div class="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg p-6 space-y-4">
                <div class="flex items-center justify-between">
                  <h4 class="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <ServerIcon class="w-5 h-5 text-gray-500" />
                    التحكم بالسيرفر
                  </h4>
                  <span :class="[
                    'px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1',
                    serverInfo.status === 'running' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  ]">
                    <Activity class="w-3 h-3" />
                    {{ serverInfo.status === 'running' ? 'يعمل حالياً' : 'متوقف' }}
                  </span>
                </div>

                <div class="flex gap-4 pt-2">
                  <button 
                    v-if="serverInfo.status !== 'running'"
                    @click="startServer" 
                    :disabled="isServerLoading"
                    class="flex-1 btn-primary flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700"
                  >
                    <Play v-if="!isServerLoading" class="w-4 h-4" />
                    <RefreshCw v-else class="w-4 h-4 animate-spin" />
                    تشغيل السيرفر
                  </button>
                  
                  <button 
                    v-if="serverInfo.status === 'running'"
                    @click="stopServer" 
                    :disabled="isServerLoading"
                    class="flex-1 btn-danger flex items-center justify-center gap-2"
                  >
                    <XCircle v-if="!isServerLoading" class="w-4 h-4" />
                    <RefreshCw v-else class="w-4 h-4 animate-spin" />
                    إيقاف السيرفر
                  </button>
                </div>
                
                <p class="text-xs text-gray-500 dark:text-gray-400">
                  يجب تشغيل السيرفر لكي تعمل تطبيقات الكاشير والموبايل. تأكد من تشغيله دائماً عند بدء العمل.
                </p>
              </div>

              <!-- Connection Links -->
              <div v-if="serverInfo.status === 'running'" class="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg p-6 space-y-4">
                <h4 class="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2 border-b pb-2">
                  <Wifi class="w-5 h-5 text-blue-500" />
                  روابط الاتصال
                </h4>
                
                <div class="space-y-3">
                  <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                    <div class="flex items-center gap-3">
                      <Globe class="w-5 h-5 text-gray-400" />
                      <div>
                        <div class="text-sm font-medium text-gray-900 dark:text-white">تطبيق الكاشير (Web)</div>
                        <div class="text-xs text-gray-500 font-mono">{{ serverInfo.cashierUrl }}</div>
                      </div>
                    </div>
                    <button @click="openLink(serverInfo.cashierUrl)" class="text-blue-600 hover:text-blue-800 text-sm font-medium">فتح</button>
                  </div>

                  <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                    <div class="flex items-center gap-3">
                      <Globe class="w-5 h-5 text-gray-400" />
                      <div>
                        <div class="text-sm font-medium text-gray-900 dark:text-white">تطبيق الموبايل (API)</div>
                        <div class="text-xs text-gray-500 font-mono">{{ serverInfo.mobileUrl }}</div>
                      </div>
                    </div>
                    <button @click="openLink(serverInfo.mobileUrl)" class="text-blue-600 hover:text-blue-800 text-sm font-medium">فتح</button>
                  </div>

                  <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                    <div class="flex items-center gap-3">
                      <SettingsIcon class="w-5 h-5 text-gray-400" />
                      <div>
                        <div class="text-sm font-medium text-gray-900 dark:text-white">لوحة تحكم السيرفر</div>
                        <div class="text-xs text-gray-500 font-mono">{{ serverInfo.backendUrl }}</div>
                      </div>
                    </div>
                    <button @click="openLink(serverInfo.backendUrl)" class="text-blue-600 hover:text-blue-800 text-sm font-medium">فتح</button>
                  </div>
                </div>
              </div>

              <!-- WhatsApp Integration -->
              <div v-if="serverInfo.status === 'running'" class="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg p-6 space-y-4">
                <h4 class="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2 border-b pb-2">
                  <MessageCircle class="w-5 h-5 text-green-500" />
                  ربط الواتساب (الإشعارات والترويج)
                </h4>

                <div v-if="whatsappStatus === 'connected'" class="text-center py-4">
                  <div class="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <CheckCircle class="w-8 h-8" />
                  </div>
                  <h5 class="text-lg font-bold text-gray-900 dark:text-white mb-1">الواتساب متصل</h5>
                  <p class="text-sm text-gray-500 mb-4">يمكنك الآن إرسال الرسائل عبر الواتساب</p>
                  <button @click="logoutWhatsApp" :disabled="whatsappLoading" class="btn-danger w-full flex items-center justify-center gap-2">
                    <XCircle v-if="!whatsappLoading" class="w-4 h-4" />
                    <RefreshCw v-else class="w-4 h-4 animate-spin" />
                    {{ whatsappLoading ? 'جاري الفصل...' : 'فصل الاتصال' }}
                  </button>
                </div>

                <div v-else-if="whatsappStatus === 'scanning' && whatsappQR" class="text-center py-4">
                  <p class="text-sm text-gray-600 mb-4">امسح الكود لربط الواتساب</p>
                  <div class="bg-white p-2 inline-block rounded-lg border mx-auto">
                    <img :src="whatsappQR" class="w-48 h-48 object-contain mx-auto" alt="WhatsApp QR Code" />
                  </div>
                  <p class="text-xs text-gray-400 mt-2">سيتم تحديث الحالة تلقائياً بعد المسح</p>
                </div>

                <div v-else class="text-center py-4">
                  <div class="w-16 h-16 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-3">
                    <RefreshCw class="w-8 h-8 animate-spin" />
                  </div>
                  <h5 class="text-lg font-bold text-gray-900 dark:text-white mb-1">جاري التحميل...</h5>
                  <p class="text-sm text-gray-500 mb-4">يتم الآن تجهيز خدمة الواتساب</p>
                  <p class="text-xs text-gray-400">انتظر قليلاً ليتم إنشاء كود الربط...</p>
                </div>
              </div>
            </div>

            <!-- Server Logs -->
            <div class="bg-gray-900 text-gray-200 rounded-lg p-4 font-mono text-xs flex flex-col h-[500px]">
              <div class="flex justify-between items-center mb-2 border-b border-gray-700 pb-2">
                <span class="flex items-center gap-2 font-bold text-green-400">
                  <Terminal class="w-4 h-4" />
                  سجل العمليات (Logs)
                </span>
                <button @click="clearLogs" class="text-gray-400 hover:text-white text-xs">مسح السجل</button>
              </div>
              <div class="flex-1 overflow-y-auto space-y-1 p-2" ref="logsContainer">
                <div v-for="(log, index) in serverLogs" :key="index" class="break-all border-l-2 border-gray-700 pl-2">
                  <span class="text-gray-500">[{{ new Date().toLocaleTimeString() }}]</span>
                  <span class="ml-2">{{ log }}</span>
                </div>
                <div v-if="serverLogs.length === 0" class="text-gray-600 italic text-center mt-10">
                  لا توجد سجلات حالياً...
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- System Settings -->
        <div v-if="activeTab === 'system'" class="space-y-6 max-w-2xl animate-fade-in">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white border-b dark:border-gray-700 pb-2 mb-4">{{ t('settings.system_section.title') }}</h3>
          
          <div class="space-y-6">
            <div class="flex items-center justify-between">
              <div>
                <h4 class="text-sm font-medium text-gray-900 dark:text-white">{{ t('settings.system_section.notifications') }}</h4>
                <p class="text-xs text-gray-500 dark:text-gray-400">{{ t('settings.system_section.notifications_desc') }}</p>
              </div>
              <input v-model="settings.enableNotifications" type="checkbox" class="toggle-checkbox">
            </div>

            <div class="flex items-center justify-between">
              <div>
                <h4 class="text-sm font-medium text-gray-900 dark:text-white">{{ t('settings.system_section.auto_backup') }}</h4>
                <p class="text-xs text-gray-500 dark:text-gray-400">{{ t('settings.system_section.auto_backup_desc') }}</p>
              </div>
              <input v-model="settings.autoBackup" type="checkbox" class="toggle-checkbox">
            </div>

            <div class="pt-6 border-t">
              <button class="btn-danger w-full sm:w-auto">
                {{ t('settings.system_section.factory_reset') }}
              </button>
              <p class="mt-2 text-xs text-red-500">{{ t('settings.system_section.factory_reset_warning') }}</p>
            </div>
          </div>
        </div>

      </div>
      
      <!-- Footer Actions -->
      <div class="bg-gray-50 dark:bg-gray-900 p-4 border-t dark:border-gray-700 flex justify-end gap-3">
        <button @click="resetChanges" class="btn-secondary">{{ t('common.cancel') }}</button>
        <button @click="save" class="btn-primary">{{ t('settings.actions.save_changes') }}</button>
      </div>
    </div>

    <!-- User Modal -->
    <div v-if="showUserModal" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="showUserModal = false"></div>

        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div class="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-right overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full">
          <div class="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white mb-4" id="modal-title">
              {{ editingUser ? 'تعديل بيانات المستخدم' : 'إضافة مستخدم جديد' }}
            </h3>
            
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">الاسم</label>
                <input v-model="userForm.name" type="text" class="input-field" placeholder="الاسم الكامل">
              </div>
              
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">رقم الهاتف</label>
                  <input v-model="userForm.phone" type="text" class="input-field" placeholder="07xxxxxxxxx">
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">البريد الإلكتروني</label>
                  <input v-model="userForm.email" type="email" class="input-field" placeholder="example@mail.com">
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {{ editingUser ? 'كلمة المرور (اتركها فارغة لعدم التغيير)' : 'كلمة المرور' }}
                </label>
                <input v-model="userForm.password" type="password" class="input-field" placeholder="******">
              </div>

              <div v-if="userForm.role === 'customer'">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">رصيد المحفظة</label>
                <input v-model="userForm.walletBalance" type="number" class="input-field" placeholder="0">
              </div>

              <div v-if="userForm.role !== 'customer'">
                 <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">الصلاحية</label>
                 <select v-model="userForm.role" class="input-field">
                   <option value="admin">مدير النظام (Admin)</option>
                   <option value="cashier">كاشير (Cashier)</option>
                 </select>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 dark:bg-gray-900 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button @click="saveUser" type="button" class="btn-primary w-full sm:w-auto sm:mr-3 mb-3 sm:mb-0">
              حفظ
            </button>
            <button @click="showUserModal = false" type="button" class="btn-secondary w-full sm:w-auto">
              إلغاء
            </button>
          </div>
        </div>
      </div>
    </div>

    <ReportPreviewModal
      :show="showReportPreview"
      title="معاينة نموذج التقرير"
      reportTitle="تقرير مبيعات تجريبي"
      subtitle="هذا نموذج لمعاينة شكل التقرير قبل الطباعة"
      :columns="previewColumns"
      :data="previewData"
      :summary="{ total: '60,000 د.ع' }"
      @close="showReportPreview = false"
    />

    <!-- Campaign Modal -->
    <div v-if="showCampaignModal" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" @click="showCampaignModal = false"></div>
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <div class="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-right overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div class="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white mb-4" id="modal-title">
              {{ editingCampaign ? 'تعديل الحملة' : 'إنشاء حملة جديدة' }}
            </h3>
            
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">عنوان الحملة</label>
                <input v-model="campaignForm.title" type="text" class="input-field" placeholder="مثال: مكافأة العيد">
              </div>

              <div>
                 <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">نوع الحملة</label>
                 <div class="flex gap-4 mb-4">
                   <label class="flex items-center gap-2 cursor-pointer">
                     <input type="radio" v-model="campaignForm.type" value="reward" class="text-primary-600 focus:ring-primary-500">
                     <span class="text-sm text-gray-700 dark:text-gray-300">مكافأة مالية</span>
                   </label>
                   <label class="flex items-center gap-2 cursor-pointer">
                     <input type="radio" v-model="campaignForm.type" value="message" class="text-primary-600 focus:ring-primary-500">
                     <span class="text-sm text-gray-700 dark:text-gray-300">رسالة ترويجية (بدون رصيد)</span>
                   </label>
                 </div>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div v-if="campaignForm.type === 'reward'">
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">قيمة المكافأة (د.ع)</label>
                  <input v-model.number="campaignForm.amount" type="number" class="input-field" placeholder="1000">
                </div>
                <div :class="{'col-span-2': campaignForm.type !== 'reward'}">
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">الفئة المستهدفة</label>
                  <select v-model="campaignForm.targetType" class="input-field">
                    <option value="all">جميع المستخدمين</option>
                    <option value="specific">مستخدمين محددين</option>
                    <option value="most_active">الأكثر طلباً (الأكثر نشاطاً)</option>
                    <option value="least_active">الأقل نشاطاً (الخاملين)</option>
                  </select>
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">رسالة الإشعار</label>
                <textarea v-model="campaignForm.message" rows="3" class="input-field" placeholder="نص الرسالة التي ستصل للمستخدمين..."></textarea>
              </div>

              <!-- Specific Users Selection -->
              <div v-if="campaignForm.targetType === 'specific'" class="border rounded-md p-3 max-h-48 overflow-y-auto">
                <label class="block text-sm font-medium text-gray-700 mb-2">اختر المستخدمين:</label>
                <div v-for="user in appUsers" :key="user.id" class="flex items-center gap-2 mb-2">
                  <input 
                    type="checkbox" 
                    :value="user.id" 
                    :checked="campaignForm.targetConfig.userIds.includes(user.id)"
                    @change="toggleUserSelection(user.id)"
                    class="rounded text-primary-600 focus:ring-primary-500"
                  >
                  <span class="text-sm text-gray-700">{{ user.name }} ({{ user.phone }})</span>
                </div>
                <div v-if="appUsers.length === 0" class="text-sm text-gray-500 text-center">لا يوجد مستخدمين</div>
              </div>

              <!-- Limit Input for Most/Least Active -->
              <div v-if="['most_active', 'least_active'].includes(campaignForm.targetType)">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">عدد المستخدمين</label>
                <input v-model.number="campaignForm.targetConfig.limit" type="number" class="input-field" placeholder="10">
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">سيتم اختيار أفضل/أسوأ {{ campaignForm.targetConfig.limit }} مستخدم حسب عدد الطلبات</p>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 dark:bg-gray-900 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button @click="saveCampaign" type="button" class="btn-primary w-full sm:w-auto sm:mr-3 mb-3 sm:mb-0">
              حفظ
            </button>
            <button @click="showCampaignModal = false" type="button" class="btn-secondary w-full sm:w-auto">
              إلغاء
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue';
import { useI18n } from 'vue-i18n';
import { Store, Palette, Printer, Settings as SettingsIcon, Save, ScanBarcode, FileText, Download, CheckCircle, XCircle, RefreshCw, Users, ShieldCheck, Trash2, Edit, Plus, Gift, Send, Play, BarChart3, Server as ServerIcon, Wifi, Globe, Activity, Terminal, MessageCircle } from 'lucide-vue-next';
import { useSettingsStore } from '../store/settings';
import api, { whatsappApi } from '../services/api';
import { io } from 'socket.io-client';
import JsBarcode from 'jsbarcode';
import ReportPreviewModal from '../components/common/ReportPreviewModal.vue';
import InvoicePreview from '../components/common/InvoicePreview.vue';
import BarcodePreview from '../components/common/BarcodePreview.vue';

const { t } = useI18n();
const settingsStore = useSettingsStore();
const activeTab = ref('general');
const showReportPreview = ref(false);

// WhatsApp State
const whatsappStatus = ref('disconnected');
const whatsappQR = ref(null);
const whatsappLoading = ref(false);
const isElectron = window.navigator.userAgent.toLowerCase().includes('electron');
const socketUrl = isElectron ? 'http://localhost:3001' : '/';
const socket = io(socketUrl, { path: '/socket.io' });
const isConnected = ref(socket.connected);

onMounted(() => {
  fetchWhatsAppStatus();
  
  socket.on('connect', () => {
    isConnected.value = true;
  });

  socket.on('disconnect', () => {
    isConnected.value = false;
  });

  socket.on('whatsapp-status', (data) => {
    whatsappStatus.value = data.status;
    whatsappQR.value = data.qr || null;
    whatsappLoading.value = false;
  });

  // Update Listeners
  if (window.electronAPI) {
    window.electronAPI.getAppVersion().then(ver => {
      appVersion.value = ver;
    });

    // Get current status
    window.electronAPI.getUpdateStatus().then(state => {
      if (state) {
        updateStatus.value = state.status;
        if (state.info) updateInfo.value = state.info;
        if (state.error) errorMessage.value = state.error;
      }
    });

    window.electronAPI.onUpdateStatus((status, info) => {
      console.log('Update status:', status, info);
      updateStatus.value = status;
      if (status === 'available') {
        updateInfo.value = info;
      } else if (status === 'error') {
        errorMessage.value = info;
      }
    });

    window.electronAPI.onDownloadProgress((progressObj) => {
      downloadProgress.value = Math.round(progressObj.percent);
    });
  }
});

onUnmounted(() => {
  socket.disconnect();
  if (window.electronAPI) {
    window.electronAPI.removeUpdateListeners();
  }
});

const fetchWhatsAppStatus = async () => {
  try {
    const res = await whatsappApi.getStatus();
    whatsappStatus.value = res.data.status;
    whatsappQR.value = res.data.qr || null;
  } catch (err) {
    console.error('Failed to fetch WhatsApp status:', err);
  }
};

const logoutWhatsApp = async () => {
  try {
    whatsappLoading.value = true;
    await whatsappApi.logout();
    // Status update will come via socket
  } catch (err) {
    console.error('Failed to logout WhatsApp:', err);
    whatsappLoading.value = false;
  }
};

// User Management State
const usersList = ref([]);
const showUserModal = ref(false);
const editingUser = ref(null);
const userForm = ref({
  name: '',
  phone: '',
  email: '',
  password: '',
  role: 'customer',
  walletBalance: 0
});

const settings = ref({ ...settingsStore.$state });

// Ensure nested objects exist to prevent errors
if (!settings.value.announcement) {
  settings.value.announcement = { active: false, title: '', message: '' };
}
if (!settings.value.rewardSystem) {
  settings.value.rewardSystem = { active: true, threshold: 35000, amount: 1000, message: '' };
}
if (settings.value.welcomeBonus === undefined) {
  settings.value.welcomeBonus = 3000;
}
if (settings.value.welcomeMessage === undefined) {
  settings.value.welcomeMessage = '';
}

// Theme Logic
const toggleTheme = () => {
  settings.value.theme = settings.value.theme === 'dark' ? 'light' : 'dark';
};

watch(
  () => settings.value.theme,
  (newTheme) => {
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  },
  { immediate: true }
);

// Update Logic
const appVersion = ref('1.0.0');
const updateStatus = ref('idle'); // idle, checking, available, not-available, downloading, downloaded, error
const updateInfo = ref(null);
const downloadProgress = ref(0);
const errorMessage = ref('');

const checkForUpdate = async () => {
  updateStatus.value = 'checking';
  errorMessage.value = '';
  if (window.electronAPI) {
    await window.electronAPI.checkForUpdate();
  }
};

const downloadUpdate = async () => {
  if (window.electronAPI) {
    await window.electronAPI.downloadUpdate();
  }
};

const installUpdate = async () => {
  if (window.electronAPI) {
    await window.electronAPI.quitAndInstall();
  }
};

const tabs = computed(() => [
  { id: 'general', name: t('settings.general_section.title'), icon: Store },
  { id: 'appearance', name: t('settings.appearance_section.title'), icon: Palette },
  { id: 'rewards', name: 'نظام المكافآت', icon: Gift },
  { id: 'app_users', name: 'مستخدمين التطبيق', icon: Users },
  { id: 'cashier_users', name: 'مستخدمين الكاشير', icon: ShieldCheck },
  { id: 'invoices', name: t('settings.invoices_section.title'), icon: Printer },
  { id: 'barcode', name: 'الباركود', icon: ScanBarcode },
  { id: 'reports', name: 'التقارير', icon: FileText },
  { id: 'updates', name: 'التحديثات', icon: Download },
  { id: 'server', name: 'إدارة السيرفر', icon: ServerIcon },
  { id: 'system', name: t('settings.system_section.title'), icon: SettingsIcon },
]);

// User Management Methods
const appUsers = computed(() => usersList.value.filter(u => u.role === 'customer'));
const cashierUsers = computed(() => usersList.value.filter(u => u.role === 'admin' || u.role === 'cashier'));

const fetchUsers = async () => {
  try {
    const res = await api.get('/users');
    usersList.value = res.data;
  } catch (err) {
    console.error('Failed to fetch users:', err);
  }
};

const openAddUser = (role) => {
  editingUser.value = null;
  userForm.value = { name: '', phone: '', email: '', password: '', role, walletBalance: 0 };
  showUserModal.value = true;
};

const openEditUser = (user) => {
  editingUser.value = user;
  userForm.value = { ...user, password: '' }; // Don't show password
  showUserModal.value = true;
};

const saveUser = async () => {
  try {
    const payload = { ...userForm.value };
    if (!payload.password) delete payload.password; // Don't send empty password
    
    if (editingUser.value) {
      await api.put(`/users/${editingUser.value.id}`, payload);
    } else {
      await api.post('/users', payload);
    }
    await fetchUsers();
    showUserModal.value = false;
    alert('تم الحفظ بنجاح');
  } catch (err) {
    alert(err.response?.data?.error || 'حدث خطأ أثناء الحفظ');
  }
};

const deleteUser = async (id) => {
  if (!confirm('هل أنت متأكد من الحذف؟ لا يمكن التراجع عن هذا الإجراء.')) return;
  try {
    await api.delete(`/users/${id}`);
    await fetchUsers();
  } catch (err) {
    alert('حدث خطأ أثناء الحذف');
  }
};

const previewData = [
  { id: 1, name: 'منتج تجريبي 1', quantity: 5, price: '5,000 د.ع', total: '25,000 د.ع' },
  { id: 2, name: 'منتج تجريبي 2', quantity: 2, price: '10,000 د.ع', total: '20,000 د.ع' },
  { id: 3, name: 'منتج تجريبي 3', quantity: 1, price: '15,000 د.ع', total: '15,000 د.ع' },
];

const previewColumns = [
  { key: 'name', label: 'المنتج' },
  { key: 'quantity', label: 'الكمية' },
  { key: 'price', label: 'السعر' },
  { key: 'total', label: 'الإجمالي' },
];

const colors = computed(() => [
  { name: t('settings.colors.sky'), value: '#0ea5e9' }, // sky-500
  { name: t('settings.colors.blue'), value: '#2563eb' }, // blue-600
  { name: t('settings.colors.violet'), value: '#7c3aed' }, // violet-600
  { name: t('settings.colors.pink'), value: '#db2777' }, // pink-600
  { name: t('settings.colors.red'), value: '#dc2626' }, // red-600
  { name: t('settings.colors.orange'), value: '#ea580c' }, // orange-600
  { name: t('settings.colors.green'), value: '#16a34a' }, // green-600
  { name: t('settings.colors.gray'), value: '#4b5563' }, // gray-600
]);

// Campaigns Logic
const campaigns = ref([]);
const campaignsError = ref('');
const showCampaignModal = ref(false);
const editingCampaign = ref(null);
const campaignForm = ref({
  title: '',
  message: '',
  amount: 0,
  type: 'reward',
  targetType: 'all',
  targetConfig: {
    userIds: [],
    limit: 10
  }
});

const fetchCampaigns = async () => {
  campaignsError.value = '';
  try {
    const res = await api.get('/campaigns');
    campaigns.value = res.data;
  } catch (err) {
    console.error('Failed to fetch campaigns:', err);
    campaignsError.value = 'فشل تحميل الحملات: ' + (err.response?.data?.error || err.message || 'خطأ غير معروف');
  }
};

const openCreateCampaign = () => {
  editingCampaign.value = null;
  campaignForm.value = {
    title: '',
    message: '',
    amount: 0,
    type: 'message', // Default to message
    targetType: 'all',
    targetConfig: { userIds: [], limit: 10 }
  };
  showCampaignModal.value = true;
};

const openEditCampaign = (campaign) => {
  editingCampaign.value = campaign;
  const form = JSON.parse(JSON.stringify(campaign));
  form.type = form.amount > 0 ? 'reward' : 'message';
  campaignForm.value = form;
  showCampaignModal.value = true;
};

const saveCampaign = async () => {
  try {
    const payload = { ...campaignForm.value };
    if (payload.type === 'message') {
      payload.amount = 0;
    }
    delete payload.type;

    let res;
    if (editingCampaign.value) {
      res = await api.put(`/campaigns/${editingCampaign.value.id}`, payload);
    } else {
      res = await api.post('/campaigns', payload);
    }
    
    await fetchCampaigns();
    showCampaignModal.value = false;
    alert('تم حفظ الحملة بنجاح');
  } catch (err) {
    alert('حدث خطأ أثناء الحفظ');
  }
};

const sendCampaign = async (id) => {
  if (!confirm('هل أنت متأكد من إرسال المكافآت؟ لا يمكن التراجع عن هذا الإجراء.')) return;
  try {
    const res = await api.post(`/campaigns/${id}/send`);
    await fetchCampaigns();
    const type = res.data.campaign?.type || 'reward';
    const msg = type === 'reward' ? 'المكافآت' : 'الرسائل';
    alert(`تم إرسال ${msg} بنجاح إلى ${res.data.count} مستخدم`);
  } catch (err) {
    alert('حدث خطأ أثناء الإرسال');
  }
};

const deleteCampaign = async (id) => {
  if (!confirm('هل أنت متأكد من الحذف؟')) return;
  try {
    await api.delete(`/campaigns/${id}`);
    await fetchCampaigns();
  } catch (err) {
    alert('حدث خطأ أثناء الحذف');
  }
};

const toggleUserSelection = (userId) => {
  const index = campaignForm.value.targetConfig.userIds.indexOf(userId);
  if (index === -1) {
    campaignForm.value.targetConfig.userIds.push(userId);
  } else {
    campaignForm.value.targetConfig.userIds.splice(index, 1);
  }
};

// Server Management Logic
const serverInfo = ref({
  ip: 'Unknown',
  backendUrl: '',
  cashierUrl: '',
  mobileUrl: '',
  status: 'stopped'
});
const serverLogs = ref([]);
const logsContainer = ref(null);
const isServerLoading = ref(false);

const fetchServerInfo = async () => {
  if (window.electronAPI && window.electronAPI.server) {
    try {
      const info = await window.electronAPI.server.getInfo();
      serverInfo.value = info;
    } catch (e) {
      console.error('Failed to get server info', e);
    }
  }
};

const startServer = async () => {
  if (window.electronAPI && window.electronAPI.server) {
    isServerLoading.value = true;
    try {
      const res = await window.electronAPI.server.start();
      if (res.success || res.message === 'Backend already running') {
        serverInfo.value.status = 'running';
      } else {
        alert('فشل تشغيل السيرفر: ' + res.message);
      }
    } catch (e) {
      alert('حدث خطأ: ' + e.message);
    } finally {
      isServerLoading.value = false;
      await fetchServerInfo();
    }
  }
};

const stopServer = async () => {
  if (window.electronAPI && window.electronAPI.server) {
    if (!confirm('هل أنت متأكد من إيقاف السيرفر؟ ستتوقف جميع التطبيقات المتصلة.')) return;
    
    isServerLoading.value = true;
    try {
      const res = await window.electronAPI.server.stop();
      if (res.success) {
        serverInfo.value.status = 'stopped';
      } else {
        alert('فشل إيقاف السيرفر: ' + res.message);
      }
    } catch (e) {
      alert('حدث خطأ: ' + e.message);
    } finally {
      isServerLoading.value = false;
      await fetchServerInfo();
    }
  }
};

const openLink = (url) => {
  if (window.electronAPI && window.electronAPI.server) {
    window.electronAPI.server.openExternal(url);
  } else {
    window.open(url, '_blank');
  }
};

const clearLogs = () => {
  serverLogs.value = [];
};

watch(() => serverLogs.value.length, async () => {
  await nextTick();
  if (logsContainer.value) {
    logsContainer.value.scrollTop = logsContainer.value.scrollHeight;
  }
});

onMounted(async () => {
  // Fetch settings from backend first
  await settingsStore.fetchSettings();

  // Clone settings to local state to allow cancellation
  settings.value = { ...settingsStore.$state };

  // Fetch users initially
  await fetchUsers();
  await fetchCampaigns();
  await fetchServerInfo();

  if (window.electronAPI) {
    if (window.electronAPI.server) {
      window.electronAPI.server.onLog((log) => {
        serverLogs.value.push(log);
        if (serverLogs.value.length > 100) serverLogs.value.shift(); // Keep last 100 logs
      });
      
      window.electronAPI.server.onStatusChanged((status) => {
        serverInfo.value.status = status;
      });
    }

    try {
      appVersion.value = await window.electronAPI.getAppVersion();
    } catch (e) {
      console.error('Failed to get app version', e);
    }
    
    window.electronAPI.onUpdateStatus((status, info) => {
      console.log('Update status:', status, info);
      if (status === 'checking') updateStatus.value = 'checking';
      if (status === 'available') {
        updateStatus.value = 'available';
        updateInfo.value = info;
      }
      if (status === 'not-available') updateStatus.value = 'not-available';
      if (status === 'downloaded') {
        updateStatus.value = 'downloaded';
        updateInfo.value = info;
      }
      if (status === 'error') {
        updateStatus.value = 'error';
        errorMessage.value = info;
      }
    });

    window.electronAPI.onDownloadProgress((progressObj) => {
      updateStatus.value = 'downloading';
      downloadProgress.value = Math.floor(progressObj.percent);
    });
  }
});

onUnmounted(() => {
  if (window.electronAPI && window.electronAPI.removeUpdateListeners) {
    window.electronAPI.removeUpdateListeners();
  }
});

watch(
  () => [
    activeTab.value,
    settings.value.barcodeFormat,
    settings.value.barcodeWidth,
    settings.value.barcodeHeight,
    settings.value.barcodeShowText,
    settings.value.barcodeFontSize,
    settings.value.barcodeMargin
  ],
  () => {
    // No manual render needed, component handles it
  }
);

const handleLogoUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      settings.value.invoiceLogoUrl = e.target.result;
    };
    reader.readAsDataURL(file);
  }
};

const saveMobileSettings = async () => {
  settingsStore.updateSettings(settings.value);
  await settingsStore.saveSettingsToBackend(settings.value);
  alert('تم حفظ الإعدادات بنجاح وتم تعميمها على التطبيقات');
};

const save = async () => {
  settingsStore.updateSettings(settings.value);
  await settingsStore.saveSettingsToBackend(settings.value);
  // Ideally show a toast notification here
  alert(t('common.success'));
};

const resetChanges = () => {
  settings.value = { ...settingsStore.$state };
};
</script>

<style scoped>
.input-field {
  @apply mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-primary-600 focus:border-primary-600 transition-colors dark:bg-gray-700 dark:border-gray-600 dark:text-white;
}

.btn-primary {
  @apply px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors font-medium;
}

.btn-secondary {
  @apply px-6 py-2 bg-white text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors font-medium dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-700;
}

.btn-danger {
  @apply px-6 py-2 bg-white text-red-600 border border-red-300 rounded-md hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors font-medium dark:bg-gray-800 dark:hover:bg-gray-700;
}

.toggle-checkbox {
  @apply h-6 w-6 text-primary-600 focus:ring-primary-500 border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600;
}

.animate-fade-in {
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
