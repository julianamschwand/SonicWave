import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import AboutView from '@/views/AboutView.vue'
import LibraryView from '@/views/LibraryView.vue'
import AllPlaylistsView from '@/views/AllPlaylistsView.vue'
import PlaylistView from '@/views/PlaylistView.vue'
import BrowseView from '@/views/BrowseView.vue'
import DownloadView from '@/views/DownloadView.vue'
import AdminPanelView from '@/views/AdminPanelView.vue'
import LoginView from '@/views/LoginView.vue'
import RegisterView from '@/views/RegisterView.vue'
import WelcomeView from '@/views/WelcomeView.vue'
import EditSongView from '@/views/EditSongView.vue'
import EditPlaylistView from '@/views/EditPlaylistView.vue'
import CreatePlaylistView from '@/views/CreatePlaylistView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/welcome',
      name: 'welcome',
      component: WelcomeView,
    },
    {
      path: '/about',
      name: 'about',
      component: AboutView,
    },
    {
      path: '/library',
      name: 'library',
      component: LibraryView,
    },
    {
      path: '/playlists',
      name: 'playlists',
      component: AllPlaylistsView,
    },
    {
      path: '/playlists/:id',
      name: 'playlist',
      component: PlaylistView,
    },
    {
      path: '/browse',
      name: 'browse',
      component: BrowseView,
    },
    {
      path: '/download',
      name: 'download',
      component: DownloadView,
    },
    {
      path: '/admin-panel',
      name: 'admin panel',
      component: AdminPanelView,
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
    },
    {
      path: '/edit/song/:id',
      name: 'edit song',
      component: EditSongView,
    },
    {
      path: '/edit/playlist/:id',
      name: 'edit playlist',
      component: EditPlaylistView,
    },
    {
      path: '/playlists/create',
      name: 'create playlist',
      component: CreatePlaylistView,
    },
  ],
})

export default router
