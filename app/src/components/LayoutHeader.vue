<template>
   <header
    class="bg-white flex items-center h-28 text-grey-400 justify-between"
    aria-label="Top"
    style="background-color: #3b3939;, color: #fff !important; "
    
  >
    <div class="relative group">
      <div class="font-medium flex items-center h-14 cursor-pointer">
        <router-link to="/">
          <span style="font-family: fantasy; color: #fff;fontsize:5vh;">Biblio Tech</span>
        </router-link>
        <div class="ml-4  md:block">
         <span style="color: #fff;fontsize:5vh;">GRANTS</span>
        </div>
        <div class="ml-1">
          <ArrowBottomIcon class="icon-small icon-primary" />
        </div>
      </div>

      <div
        class="
          absolute
          hidden
          left-2
          md:left-20
          group-hover:flex
          z-10
          border border-grey-400
          p-6
          pr-10
          bg-white
          text-grey-400
          flex-col
          gap-y-2
          uppercase
          font-medium
        "
      >
        <router-link
          v-for="link in navigation"
          :key="link.name"
          :to="{ name: link.name }"
          active-class="font-medium text-grey-500"
          exact
          class="hover:text-grey-500"
        >
          {{ link.label }}
        </router-link>

        <div class="border-b border-grey-400"></div>

        <div @click="emitEvent('toggleAbout')" class="text-grey-400 hover:text-grey-500 uppercase cursor-pointer">
          About
        </div>
      </div>
    </div>

    <div class="flex items-center justify-between gap-x-4">
      <router-link :to="{ name: 'Cart' }" class="flex items-center gap-x-2 h-14 group cursor-pointer pr-2">
        <div class=" md:block group-hover:text-grey-500" style="color: #fff;fontsize:5vh;">Cart</div>
        <CartIcon class="icon-small icon-primary" />
        <div class="group-hover:text-grey-500" style="color: #fff;fontsize:5vh;">{{ cartItemsCount }}</div>
      </router-link>
      <div class="border-r border-grey-100 h-14"></div>

      <div v-if="userAddress" class="ml-auto flex items-center gap-x-4 md:gap-x-8">
        <div class="group relative">
          <div class="flex items-center h-16 gap-x-2 space-x-2 group cursor-pointer">
            <div class="hidden md:block group-hover:text-grey-500">
              <span style="color: #fff;fontsize:5vh;">{{ userDisplayName }}</span>
            </div>
            <div class="flex items-center" style="color: #fff;fontsize:5vh;">
              <figure>
                <Jazzicon :address="userAddress" :key="userAddress" :width="38" />
              </figure>
              <ArrowBottomIcon style="color: #fff;fontsize:5vh;" class="icon-small icon-primary" />
            </div>
          </div>
          <!-- menu-->
          <div
            class="
              absolute
              hidden
              group-hover:flex
              z-10
              border border-grey-400
              p-5
              right-2
              bg-white
              text-grey-400
              flex-col
              gap-y-2
              uppercase
              font-medium
              text-left
              whitespace-nowrap
            "
            style="color: #fff;fontsize:5vh;"
          >
            <div>{{ userDisplayName }}</div>

            <div class="border-b border-grey-400 my-4"></div>

            <router-link
              v-for="link in myNavigation"
              :key="link.name"
              :to="{ name: link.name }"
              active-class="font-medium text-grey-500"
              exact
              class="hover:text-grey-500"
              style="color: #fff;fontsize:5vh;"
            >
              {{ link.label }}
            </router-link>

            <div class="border-b border-grey-400 my-4" style="color: #fff;fontsize:5vh;"></div>

            <button
              @click="changeWallet"
              class="cursor-pointer hover:text-grey-500 flex no-underline uppercase font-medium"
              style="color: #fff;fontsize:5vh;"
            >
              change wallet
            </button>
            <button
              @click="disconnectWallet"
              class="cursor-pointer hover:text-grey-500 flex no-underline uppercase font-medium"
              style="color: #fff;fontsize:5vh;"
            >
              disconnect wallet
            </button>
          </div>
        </div>
      </div>

      <!-- connect wallet -->
      <div v-else @click="connectWallet" class="flex items-center h-14 gap-x-2 group cursor-pointer ml-auto">
        <div class="hidden md:block group-hover:text-grey-500" style="color: #fff;fontsize:5vh;">Connect</div>
        <div>
          <ConnectWalletIcon class="icon icon-primary" />
        </div>
      </div>
    </div>
  </header>
  <img src="https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg" class="bg__img">

</template>

<script lang="ts">
// --- External Imports ---
import { defineComponent } from 'vue';
import { Wallet3Icon as ConnectWalletIcon } from '@fusion-icons/vue/web3';
import { ArrowBottom2Icon as ArrowBottomIcon } from '@fusion-icons/vue/interface';
import { Cart2Icon as CartIcon } from '@fusion-icons/vue/interface';
// --- App Imports ---
import Jazzicon from 'src/components/Jazzicon.vue';
// --- Store ---
import useWalletStore from 'src/store/wallet';
import useCartStore from 'src/store/cart';
// Header menu bar items
const navigation = [
  { label: 'Home', name: 'Home' },
  { label: 'Rounds', name: 'dgrants-rounds-list' },
  { label: 'Grants', name: 'dgrants' },
];

// Header menu bar items
const myNavigation = [
  { label: 'My Grants', name: 'dgrants-my-grants' },
  { label: 'My Contributions', name: 'contribution' },
];

// Composition function for wallet management in the header. All reading/writing related to the user's wallet
// is managed in this composition function, which reads/writes to/from src/store/wallet.ts store
function useWalletConnection() {
  const { connectWallet, disconnectWallet, changeWallet, isSupportedNetwork, userDisplayName, userAddress } =
    useWalletStore();

  return { disconnectWallet, changeWallet, connectWallet, isSupportedNetwork, userDisplayName, userAddress };
}

export default defineComponent({
  name: 'LayoutHeader',
  components: { ConnectWalletIcon, ArrowBottomIcon, CartIcon, Jazzicon },
  setup(_props, context) {
    const { cartItemsCount } = useCartStore();
    const emitEvent = (eventName: string) => context.emit(eventName);

    return {
      cartItemsCount,
      navigation,
      myNavigation,
      emitEvent,
      ...useWalletConnection(),
    };
  },
});
</script>
