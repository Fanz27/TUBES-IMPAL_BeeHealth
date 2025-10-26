import salad2 from "/images/salad2.png";

const MainDashboard = (props) => {
  return (
    <section className="container mx-auto py-16 px-4">
      <div className="flex flex-col gap-24">
        {/* Bagian 1 */}
        <div className="mb-16 flex flex-col md:flex-row items-center gap-8">
          <div className="md:w1/2 text-center md:text-left">
            <h2 className="text-3xl text-bold mb-4">
              Pola Makan Baik Buat Tubuh Sehat
            </h2>
            <p className="text-grey-600 max-w-3xl">
              Ingin tubuh sehat dan bugar? Sangat tepat anda mengunjungi
              BeeHealth. BeeHealth menyediakan fitur yang anda butuhkan dalam
              mengelola pola makan yang baik.
            </p>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <img
              src={salad2}
              alt="Salad Buah"
              className="max-w-sm rounded-lg"
            />
          </div>
        </div>

        {/* Bagian 2 */}
        <div className="mb-16 flex flex-col md:flex-row items-center gap-8">
          <div className="md:w-1/2 text-center md:text-left">
            <h2 className="text-3xl text-bold mb-4">
              Catat Lebih dari 10 Juta Makanan
            </h2>
            <p className="text-grey-600">
              Lihat rincian kalori dan bandingkan apa yang akan terjadi.
            </p>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <img
              src={salad2}
              alt="Salad Buah 2"
              className="w-3/4 md:w-full max-w-sm rounded-lg"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default MainDashboard;
