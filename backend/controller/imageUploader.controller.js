export const uploadImagecontroller=async(req,res)=>{
    try{
        console.log("try")
        await uploadImageToGlobalServer(resumeFile.data, resumeFile.name,'resume');

    }catch(e){
        console.log(e)
    }
}