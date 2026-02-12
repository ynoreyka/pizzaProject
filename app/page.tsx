import { Container, Title, TopBar, Filters } from "@/components/shared";
import { ProductCard } from "@/components/shared/product-card";
import { ProductsGroupList } from "@/components/shared/products-group-list";

export default function Home() {
  return <>
    <Container className="mt-10">
      <Title text="Все пиццы" size="lg" className="font-extrabold" />
    </Container>
    <TopBar />
    <Container className="mt-10 pb-14">
      <div className="flex gap-[80px]">
        {/* Фильтрация*/}
        <div className="w-[250px]">
          <Filters />
        </div>
        {/* Список товаров*/}

        <div className="flex-1">
          <div className="flex flex-col gap-16">
            <ProductsGroupList title="Пиццы" items={[{
              id: 1,
              name: 'Бургер-пицца',
              imageUrl: 'https://media.dodostatic.net/image/r:233x233/0199b77856ec79a986a2d582c2678fff.avif',
              price: 550,
              items: [{ price: 500 }]

            },
            {
              id: 2,
              name: 'Бургер-пицца',
              imageUrl: 'https://media.dodostatic.net/image/r:233x233/0199b77856ec79a986a2d582c2678fff.avif',
              price: 550,
              items: [{ price: 500 }]

            }, {
              id: 3,
              name: 'Бургер-пицца',
              imageUrl: 'https://media.dodostatic.net/image/r:233x233/0199b77856ec79a986a2d582c2678fff.avif',
              price: 550,
              items: [{ price: 500 }]

            }, {
              id: 4,
              name: 'Бургер-пицца',
              imageUrl: 'https://media.dodostatic.net/image/r:233x233/0199b77856ec79a986a2d582c2678fff.avif',
              price: 550,
              items: [{ price: 500 }]

            }, {
              id: 5,
              name: 'Бургер-пицца',
              imageUrl: 'https://media.dodostatic.net/image/r:233x233/0199b77856ec79a986a2d582c2678fff.avif',
              price: 550,
              items: [{ price: 500 }]

            }, {
              id: 6,
              name: 'Бургер-пицца',
              imageUrl: 'https://media.dodostatic.net/image/r:233x233/0199b77856ec79a986a2d582c2678fff.avif',
              price: 550,
              items: [{ price: 500 }]

            }
            ]} categoryId={1} />
            <ProductsGroupList title="Комбо" items={[{
              id: 1,
              name: 'Бургер-пицца',
              imageUrl: 'https://media.dodostatic.net/image/r:233x233/0199b77856ec79a986a2d582c2678fff.avif',
              price: 550,
              items: [{ price: 500 }]

            },
            {
              id: 2,
              name: 'Бургер-пицца',
              imageUrl: 'https://media.dodostatic.net/image/r:233x233/0199b77856ec79a986a2d582c2678fff.avif',
              price: 550,
              items: [{ price: 500 }]

            }, {
              id: 3,
              name: 'Бургер-пицца',
              imageUrl: 'https://media.dodostatic.net/image/r:233x233/0199b77856ec79a986a2d582c2678fff.avif',
              price: 550,
              items: [{ price: 500 }]

            }, {
              id: 4,
              name: 'Бургер-пицца',
              imageUrl: 'https://media.dodostatic.net/image/r:233x233/0199b77856ec79a986a2d582c2678fff.avif',
              price: 550,
              items: [{ price: 500 }]

            }, {
              id: 5,
              name: 'Бургер-пицца',
              imageUrl: 'https://media.dodostatic.net/image/r:233x233/0199b77856ec79a986a2d582c2678fff.avif',
              price: 550,
              items: [{ price: 500 }]

            }, {
              id: 6,
              name: 'Бургер-пицца',
              imageUrl: 'https://media.dodostatic.net/image/r:233x233/0199b77856ec79a986a2d582c2678fff.avif',
              price: 550,
              items: [{ price: 500 }]

            }]} categoryId={2} />
          </div>
        </div>

      </div>
    </Container>
  </>;
}
