import React from 'react';
import "./Banner.css"; // Importuj CSS soubor se styly animace

const MovingBanner = () => {
    return (
        // Vnější div: Nastavuje pozadí, vertikální padding a skryje obsah, který přesahuje (důležité pro plynulé posouvání)
        <div className="relative overflow-hidden bg-indigo-600 py-3 text-white">
            {/* Tento div: Umožňuje Flexbox pro zarovnání obsahu (i když zde je jen jeden prvek s textem) */}
            {/* Třída 'container' a 'mx-auto' byly odstraněny, aby se odstranil jejich výchozí padding a banner se roztáhl na celou šířku */}
            <div className="flex items-center">
                {/* Tento div: Obaluje posuvný text. 'flex-1' zajistí, že zabere dostupný prostor.
                    'overflow-hidden' je zde redundantní, protože je na vnějším divu, ale neškodí.
                    Horizontální padding (px-*) byl odstraněn, jak jsi požadoval. */}
                <div className="flex-1 overflow-hidden">
                    {/* Element s posuvným textem: Aplikuje CSS animaci (.animate-marquee)
                        'whitespace-nowrap' zajistí, že text zůstane na jednom řádku a nezalomí se. */}
                    <div className="animate-marquee whitespace-nowrap inline-block"> {/* Přidáno inline-block pro lepší chování šířky */}
                        {/* První část textu */}
                        <span className="text-base">GeneriCon 2023 &middot; Join us in Denver from June 7 - 9 to see what's coming next &rarr;</span>
                        {/* Druhá, duplikovaná část textu: Tato kopie je klíčová pro plynulou nekonečnou smyčku */}
                        {/* 'ml-8' přidává mezeru mezi první a druhou kopií textu */}
                        <span className="ml-8 text-base">GeneriCon 2023 &middot; Join us in Denver from June 7 - 9 to see what's coming next &rarr;</span>
                    </div>
                </div>
                {/* Tlačítko pro zavření bylo odstraněno */}
            </div>
        </div>
    );
};

export default MovingBanner;