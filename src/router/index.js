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
import AddPlaylistSongsView from '@/views/AddPlaylistSongsView.vue'
import AccountView from '@/views/AccountView.vue'
import LanderView from '@/views/LanderView.vue'
import ArtistView from '@/views/ArtistView.vue'
import EditArtistView from '@/views/EditArtistView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'lander',
      component: LanderView,
    },
    {
      path: '/home',
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
      path: '/account',
      name: 'account',
      component: AccountView,
    },
    {
      path: '/library/edit/song/:songId',
      name: 'edit library song',
      component: EditSongView,
    },
    {
      path: '/playlists/:playlistId/edit/song/:songId',
      name: 'edit playlist song',
      component: EditSongView,
    },
    {
      path: '/artist/:artistId/edit/song/:songId',
      name: 'edit artist song',
      component: EditSongView,
    },
    {
      path: '/playlists/:id/edit/playlist',
      name: 'edit playlist',
      component: EditPlaylistView,
    },
    {
      path: '/playlists/create',
      name: 'create playlist',
      component: CreatePlaylistView,
    },
    {
      path: '/playlists/:id/add-songs',
      name: 'add playlist songs',
      component: AddPlaylistSongsView,
    },
    {
      path: '/artist/:id',
      name: 'artist',
      component: ArtistView,
    },
    {
      path: '/artist/:id/edit/artist',
      name: 'edit artist',
      component: EditArtistView,
    },
  ],
})

export default router
