# 3DStructureViewer

Hey guys, this is a HTML5 canvas implementation of an .obj 3D file viewer and it's in vanilla javascript!! 

I've kept it stacked away for quite some time and it was a small bit of work to begin with, but I thought for students and 3D programming starters
this can be a good template and code study material, so I've opened it to the public.  
  
In the forth coming days, I'll be sparing some time to restructure the equations, comments and document this, so feel free to send any suggestions and PRs, cuz' 
I love anything 3D! ;-)


Some things to note:
- The code doesn't use any third party libraries, it's plain HTML5 canvas.
- The z-index is a simulated version of your typical z-buffer implementation(this bit of code needs a complete rehaul, and will attempt in forth coming days) ,
  basically for now, it's the position of the farthest vertex from the screen.
- correct drawing implements a version of painter's algorithm.
- the standard openGL pipeline is used as a reference, although a more simplified version of the pipeline is used for ease of transformation(will try to 
  fully mimic the openGL pipeline in the forth coming days.)
- The code has no backend, it's all FE. ;-) 
