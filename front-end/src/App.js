
import './App.css';
import MainHeader from './chatrr/mainHeader';
import { Toaster } from "sonner";

function App() {
  return (
    <>
    <MainHeader/>

    <Toaster
      position="top-right"
      richColors
      closeButton
    />
    </>
  );
}

export default App;
