from django.views.generic import ListView
from Home.models import MainBanner, Gallery


class HomePage(ListView):
    model = MainBanner
    template_name = 'index.html'
    context_object_name = 'banners'
    main_banners = MainBanner.objects.all()
    gallery = Gallery.objects.all()

    def create_gallery(self):
        main_dict = self.main_banners.values()
        gallery = self.gallery.values()

        for main in main_dict:
            if main['dark_mode']:
                main['dark_mode'] = '#FFD700FF'
            else:
                main['dark_mode'] = '#101010FF'

            for item in gallery:
                if item['product_id'] == main['id']:
                    position = item['position']
                    main[position] = item['image']

        return main_dict

    def get_context_data(self, *, object_list=None, **kwargs):
        context = super().get_context_data(**kwargs)
        context['main_banners'] = self.create_gallery()

        return context
