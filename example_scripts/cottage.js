//
// need to use the drone module to create buildings easily
// it can be done using calls to putBlock(), putSign(), getPlayerPos() and getMousePos()
// but it's easier to use the Drone class
// $SCRIPT_DIR is a special javascript variable whose value is the directory where the 
// current script resides.
// $SCRIPT is a special javascript variable whose value is the full name of the current script.
//
var scriptDir = $SCRIPT_DIR;
load(scriptDir + "/drone.js"); // assumes cottage.js and drone.js are in same directory
//
// usage: 
// [1] to build a cottage at the player's current location or the cross-hairs location...
//
// /js cottage();
// 
// [2] to build a cottage using an existing drone...
// 
// /js cottage(drone);
//

function cottage(/* optional */ drone)
{
    if (typeof drone == "undefined"){
        drone = new Drone();
    }
    drone.chkpt('cottage')
        .box0(48,7,2,6)  // 4 walls
        .right(3).door() // door front and center
        .up(1).left(2).box(102) // windows to left and right
        .right(4).box(102)
        .left(5).up().prism0(53,7,6);
    //
    // put up a sign near door. 
    //
    drone.down().right(4).sign(["Home","Sweet","Home"],68);
    
    return drone.move('cottage');
};
//
// a more complex script that builds an tree-lined avenue with
// cottages on both sides.
//
function cottage_road(numberCottages,/* optional */ drone)
{
    if (typeof numberCottages == "undefined"){
        numberCottages = 6;
    }
    if (typeof drone == "undefined"){
        drone = new Drone();
    }
    var i=0, distanceBetweenTrees = 11;
    //
    // step 1 build the road.
    //
    var cottagesPerSide = Math.floor(numberCottages/2);
    drone
        .chkpt("cottage_road") // make sure the drone's state is saved.
        .box(43,3,1,cottagesPerSide*(distanceBetweenTrees+1)) // build the road
        .up().right() // now centered in middle of road
        .chkpt("cr"); // will be returning to this position later

    //
    // step 2 line the road with trees
    //
    for (; i < cottagesPerSide+1;i++){
        drone
            .left(5).oak() 
            .right(10).oak()
            .left(5) // return to middle of road
            .fwd(distanceBetweenTrees+1); // move forward.
    }
    drone.move("cr").back(6); // move back 1/2 the distance between trees

    // this function builds a path leading to a cottage.
    function pathAndCottage(d){
        return cottage(d.down().box(43,1,1,5).fwd(5).left(3).up());
    };
    //
    // step 3 build cottages on each side
    //
    for (i = 0;i < cottagesPerSide; i++)
    {
        drone.fwd(distanceBetweenTrees+1).chkpt("r"+i);
        // build cottage on left
        pathAndCottage(drone.turn(3)).move("r"+i);
        // build cottage on right
        pathAndCottage(drone.turn()).move("r"+i);
    }
    // return drone to where it was at start of function
    return drone.move("cottage_road"); 
}

