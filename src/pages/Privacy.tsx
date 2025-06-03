import React, { useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Privacy: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-kiwi-dark py-20">
      <div className="container mx-auto px-4 max-w-4xl">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-white/70 hover:text-white mb-8 transition-colors duration-300"
        >
          <ArrowLeft size={20} className="mr-2" />
          Vissza
        </button>

        <div className="bg-[#23221f] rounded-2xl shadow-2xl p-8 text-white">
          <h1 className="text-3xl font-bold mb-8">Adatvédelmi Tájékoztató</h1>

          <div className="space-y-6 text-white/70">
            <section>
              <h2 className="text-xl font-semibold text-white mb-4">1. Bevezetés</h2>
              <p>
                A Kiwi Reels (továbbiakban: "mi", "minket", "miénk") elkötelezett az Ön személyes adatainak védelme mellett. 
                Ez az adatvédelmi tájékoztató tájékoztatást nyújt arról, hogyan gyűjtjük, használjuk, tároljuk és védjük az Ön személyes adatait.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">2. Adatkezelő</h2>
              <p>
                Név: Kiwi Reels<br />
                Székhely: Budapest, Magyarország<br />
                Email: info@kiwireels.hu
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">3. Gyűjtött adatok</h2>
              <p>
                A következő személyes adatokat gyűjthetjük:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li>Név</li>
                <li>Email cím</li>
                <li>Telefonszám</li>
                <li>Üzenet tartalma</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">4. Adatkezelés célja</h2>
              <p>
                Az Ön személyes adatait a következő célokra használjuk:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li>Kapcsolatfelvétel és kommunikáció</li>
                <li>Ajánlatkészítés</li>
                <li>Hírlevél küldése (csak az Ön hozzájárulásával)</li>
                <li>Szolgáltatásaink fejlesztése</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">5. Adatmegőrzés</h2>
              <p>
                Az Ön személyes adatait csak addig tároljuk, amíg az adatkezelés célja megköveteli, vagy amíg Ön nem kéri azok törlését.
                A hírlevél feliratkozás esetén az adatokat addig tároljuk, amíg Ön le nem mondja a feliratkozást.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">6. Az Ön jogai</h2>
              <p>
                Önnek joga van:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li>Hozzáférést kérni a személyes adataihoz</li>
                <li>Kérni a személyes adatainak helyesbítését</li>
                <li>Kérni a személyes adatainak törlését</li>
                <li>Kérni az adatkezelés korlátozását</li>
                <li>Adathordozhatósághoz való jogát gyakorolni</li>
                <li>Tiltakozni az adatkezelés ellen</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">7. Kapcsolat</h2>
              <p>
                Az adatvédelmi kérdésekkel kapcsolatban az alábbi elérhetőségeken léphet kapcsolatba velünk:
              </p>
              <p className="mt-2">
                Email: info@kiwireels.hu<br />
                Telefon: +36 30 123 4567
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Privacy; 