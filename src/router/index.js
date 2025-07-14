import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import AboutView from '@/views/AboutView.vue'
import LibraryView from '@/views/LibraryView.vue'
import AllPlaylistsView from '@/views/AllPlaylistsView.vue'
import PlaylistView from '@/views/PlaylistView.vue'
import BrowseView from '@/views/BrowseView.vue'
import DownloadView from '@/views/DownloadView.vue'
import AdminPanelView from '@/views/AdminPanelView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
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
  ],
})

export default router
